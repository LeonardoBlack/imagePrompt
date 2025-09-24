import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Coze API配置
const COZE_API_BASE = "https://api.coze.com";
const COZE_BOT_ID = process.env.COZE_BOT_ID || "";
const COZE_USER_ID = process.env.COZE_USER_ID || "";
const COZE_TOKEN = process.env.COZE_ACCESS_TOKEN || "";

// 请求和响应的Zod模式
const imageAnalysisInput = z.object({
  imageUrl: z.string().url(),
  workflowId: z.string().optional(),
});

const imageAnalysisOutput = z.object({
  success: z.boolean(),
  prompt: z.string().optional(),
  error: z.string().optional(),
  workflowId: z.string().optional(),
  conversationId: z.string().optional(),
});

export const cozeRouter = createTRPCRouter({
  // 分析图片并生成提示词
  analyzeImage: protectedProcedure
    .input(imageAnalysisInput)
    .output(imageAnalysisOutput)
    .mutation(async ({ input }) => {
      try {
        // 检查Coze配置
        if (!COZE_TOKEN || !COZE_BOT_ID || !COZE_USER_ID) {
          return {
            success: false,
            error: "Coze API配置不完整，请联系管理员配置COZE_ACCESS_TOKEN、COZE_BOT_ID和COZE_USER_ID",
          };
        }

        // 调用Coze API创建工作流会话
        const response = await fetch(`${COZE_API_BASE}/v1/conversation/create`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${COZE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bot_id: COZE_BOT_ID,
            user_id: COZE_USER_ID,
            additional_messages: [
              {
                role: "user",
                content: JSON.stringify({
                  type: "image",
                  data: input.imageUrl,
                  prompt: "请分析这张图片并生成详细的AI绘图提示词"
                })
              }
            ]
          }),
        });

        if (!response.ok) {
          throw new Error(`Coze API error: ${response.status}`);
        }

        const data = await response.json();
        
        return {
          success: true,
          prompt: data.messages?.[0]?.content || "分析完成，但未获取到提示词",
          conversationId: data.conversation_id,
          workflowId: input.workflowId,
        };
      } catch (error) {
        console.error('Coze API Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '未知错误',
        };
      }
    }),

  // 获取工作流状态
  getWorkflowStatus: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const response = await fetch(`${COZE_API_BASE}/v1/conversation/retrieve`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${COZE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          params: {
            bot_id: COZE_BOT_ID,
            user_id: COZE_USER_ID,
            conversation_id: input.conversationId,
          },
        });

        if (!response.ok) {
          throw new Error(`Coze API error: ${response.status}`);
        }

        const data = await response.json();
        
        return {
          success: true,
          status: data.status,
          messages: data.messages,
        };
      } catch (error) {
        console.error('Coze API Error:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '未知错误',
        };
      }
    }),
});