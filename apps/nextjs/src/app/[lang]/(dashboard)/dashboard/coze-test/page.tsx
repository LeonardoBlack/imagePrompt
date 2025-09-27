"use client";

import { useState } from "react";
import { Button } from "@saasfly/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saasfly/ui/card";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";
import { Textarea } from "@saasfly/ui/textarea";
import { useToast } from "@saasfly/ui/use-toast";
import { Loader2, Image as ImageIcon, Copy, Download } from "lucide-react";

const COZE_TOKEN = "cztei_qOazV6mchuUguv4HCYopPce7A8RItrPlVdI9hQvNHFUM4JZjcz3N6BiMoENPBR1J4";
const WORKFLOW_ID = "7552453818337689652";

export default function CozeTestPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [rawResponse, setRawResponse] = useState("");
  const { toast } = useToast();

  const analyzeImage = async () => {
    if (!imageUrl) {
      toast({
        title: "请输入图片URL",
        description: "请先输入要分析的图片链接",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setGeneratedPrompt("");
    setRawResponse("");

    try {
      console.log("调用Coze工作流API...");
      
      const response = await fetch("https://api.coze.cn/v1/workflow/stream_run", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${COZE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflow_id: WORKFLOW_ID,
          parameters: {
            img: imageUrl,
            promptType: "flux",
            userQuery: "描述一下这张图片"
          }
        }),
      });

      console.log("响应状态:", response.status);
      console.log("响应头:", Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log("原始响应:", responseText);
      setRawResponse(responseText);

      if (!response.ok) {
        throw new Error(`API错误: ${response.status} - ${responseText}`);
      }

      // 尝试解析响应
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        // 如果不是JSON，尝试按行解析
        const lines = responseText.split('\n').filter(line => line.trim());
        const lastLine = lines[lines.length - 1];
        if (lastLine) {
          try {
            result = JSON.parse(lastLine);
          } catch {
            result = { data: { output: responseText } };
          }
        }
      }

      console.log("解析结果:", result);

      if (result?.data?.output) {
        setGeneratedPrompt(result.data.output);
        toast({
          title: "分析成功",
          description: "图片提示词已生成",
        });
      } else if (result?.messages?.[result.messages.length - 1]?.content) {
        setGeneratedPrompt(result.messages[result.messages.length - 1].content);
        toast({
          title: "分析成功",
          description: "图片提示词已生成",
        });
      } else {
        setGeneratedPrompt("分析完成，但未获取到提示词内容");
        toast({
          title: "分析完成",
          description: "请查看原始响应内容",
        });
      }

    } catch (error) {
      console.error("图片分析错误:", error);
      toast({
        title: "分析失败",
        description: error instanceof Error ? error.message : "网络请求失败",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "已复制",
      description: "内容已复制到剪贴板",
    });
  };

  const downloadResponse = () => {
    const blob = new Blob([rawResponse], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coze-response-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Coze工作流测试
          </CardTitle>
          <CardDescription>
            直接调用Coze工作流API测试图片逆推提示词功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 图片URL输入 */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">图片URL</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isAnalyzing}
            />
          </div>

          {/* 测试图片示例 */}
          <div className="space-y-2">
            <Label>测试图片示例</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImageUrl("https://p3-bot-workflow-sign.byteimg.com/tos-cn-i-mdko3gqilj/1ee21c36a6594189b14d9a97a966cd71.png~tplv-mdko3gqilj-image.image?rk3s=81d4c505&x-expires=1789567383&x-signature=rF85ZnwKEBRulXSmjv%2BAssaBvGo%3D&x-wf-file_name=yunling_tcm_avatar_studious_20250912024557_1+%282%29.png")}
              >
                使用示例图片
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImageUrl("https://images.unsplash.com/photo-1574169208507-84376144848b?w=400")}
              >
                风景图片
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImageUrl("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400")}
              >
                人物图片
              </Button>
            </div>
          </div>

          {/* 分析按钮 */}
          <Button
            onClick={analyzeImage}
            disabled={isAnalyzing || !imageUrl}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4 mr-2" />
                开始分析
              </>
            )}
          </Button>

          {/* 生成的提示词 */}
          {generatedPrompt && (
            <div className="space-y-2">
              <Label>生成的提示词</Label>
              <Textarea
                value={generatedPrompt}
                readOnly
                rows={8}
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(generatedPrompt)}
              >
                <Copy className="h-4 w-4 mr-2" />
                复制提示词
              </Button>
            </div>
          )}

          {/* 原始响应 */}
          {rawResponse && (
            <div className="space-y-2">
              <Label>原始API响应</Label>
              <Textarea
                value={rawResponse}
                readOnly
                rows={10}
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={downloadResponse}
              >
                <Download className="h-4 w-4 mr-2" />
                下载响应
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}