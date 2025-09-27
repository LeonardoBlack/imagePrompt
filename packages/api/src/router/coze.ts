import { z } from "zod";
import { CozeAPI } from '@coze/api';

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Coze API配置
const COZE_API_BASE = "https://api.coze.cn";
const COZE_BOT_ID = process.env.COZE_BOT_ID || "";
const COZE_USER_ID = process.env.COZE_USER_ID || "";
const COZE_TOKEN = process.env.COZE_ACCESS_TOKEN || "";

// 创建Coze API客户端
let cozeClient: CozeAPI | null = null;
if (COZE_TOKEN) {
  cozeClient = new CozeAPI({
    token: COZE_TOKEN,
    baseURL: COZE_API_BASE
  });
}

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
  // 分析图片并生成提示词 - 支持工作流和对话两种模式
  analyzeImage: protectedProcedure
    .input(imageAnalysisInput)
    .output(imageAnalysisOutput)
    .mutation(async ({ input }) => {
      try {
        // 检查Coze配置
        if (!cozeClient) {
          return {
            success: false,
            error: "Coze API客户端未初始化，请检查COZE_ACCESS_TOKEN配置",
          };
        }

        // 如果有指定工作流ID，使用官方SDK调用工作流API
        if (input.workflowId) {
          try {
            console.log('🚀 使用官方SDK调用工作流API:', input.workflowId);
            
            const response = await cozeClient.workflows.runs.create({
              workflow_id: input.workflowId,
              parameters: {
                img: input.imageUrl,
                promptType: "flux",
                userQuery: "描述一下这张图片"
              }
            });

            console.log('✅ 工作流API响应:', response);

            if (response.code === 0 && response.data) {
              // 解析返回的数据
              const data = JSON.parse(response.data);
              return {
                success: true,
                prompt: data.output || "工作流分析完成",
                workflowId: input.workflowId,
              };
            } else {
              console.log('工作流API返回错误:', response.msg);
              return {
                success: false,
                error: response.msg || '工作流API调用失败',
              };
            }
          } catch (workflowError) {
            console.error('❌ 工作流API错误:', workflowError);
            // 如果工作流API失败，继续尝试对话API
            console.log('🔄 回退到对话API...');
          }
        }

        // 使用对话API作为回退方案
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
                content: `请分析这张图片并生成详细的AI绘图提示词: ${input.imageUrl}`
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
          prompt: data.messages?.[data.messages.length - 1]?.content || "分析完成，但未获取到提示词",
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