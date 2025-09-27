"use client";

import { useState } from "react";
import { Button } from "@saasfly/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saasfly/ui/card";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";
import { Textarea } from "@saasfly/ui/textarea";
import { useToast } from "@saasfly/ui/use-toast";
import { Loader2, Image as ImageIcon, Copy, Download, Bug, AlertTriangle, CheckCircle } from "lucide-react";

interface DebugInfo {
  timestamp: string;
  apiEndpoint: string;
  requestHeaders: Record<string, string>;
  requestBody: any;
  responseStatus: number;
  responseHeaders: Record<string, string>;
  responseBody: any;
  error?: string;
}

export function CozeDebugPanel() {
  const [imageUrl, setImageUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [useMockMode, setUseMockMode] = useState(false); // 默认使用真实API
  const { toast } = useToast();

  const mockAnalyze = async () => {
    setIsAnalyzing(true);
    
    // 模拟API响应
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockDebugInfo: DebugInfo = {
      timestamp: new Date().toISOString(),
      apiEndpoint: "https://api.coze.cn/v1/workflow/stream_run",
      requestHeaders: {
        "Authorization": "Bearer cztei_qOazV6mchuUguv4HCYopPce7A8RItrPlVdI9hQvNHFUM4JZjcz3N6BiMoENPBR1J4",
        "Content-Type": "application/json",
      },
      requestBody: {
        workflow_id: "7552453818337689652",
        parameters: {
          img: imageUrl,
          promptType: "flux",
          userQuery: "描述一下这张图片"
        }
      },
      responseStatus: 401,
      responseHeaders: {
        "content-type": "application/json; charset=utf-8",
        "server": "volc-dcdn",
      },
      responseBody: {
        code: 4100,
        msg: "authentication is invalid",
        detail: {
          logid: `20250927${Date.now()}`
        }
      },
      error: "访问令牌无效或已过期"
    };

    setDebugInfo(mockDebugInfo);
    
    // 生成模拟提示词
    const mockPrompt = `高质量摄影风格，${imageUrl.includes('portrait') ? '人物肖像' : '风景'}，专业构图，柔和光线，细节丰富，8K分辨率，专业摄影设备拍摄`;
    setGeneratedPrompt(mockPrompt);
    
    toast({
      title: "模拟分析完成",
      description: "当前为演示模式，实际API调用失败",
      variant: "default",
    });
    
    setIsAnalyzing(false);
  };

  const realAnalyze = async () => {
    setIsAnalyzing(true);
    setDebugInfo(null);

    try {
      const startTime = Date.now();
      
      // 使用有效的令牌
      const response = await fetch("https://api.coze.cn/v1/workflow/stream_run", {
        method: "POST",
        headers: {
          "Authorization": "Bearer cztei_hQDxl4BqtMbaiyBeDhIsEqeaVXnNMg2CpmpxuzoBxcXKWL55IKWc6LhwYJF8OWWby",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workflow_id: "7552453818337689652",
          parameters: {
            img: imageUrl,
            promptType: "flux",
            userQuery: "描述一下这张图片"
          }
        }),
      });

      const endTime = Date.now();
      const responseText = await response.text();
      
      const debugInfo: DebugInfo = {
        timestamp: new Date().toISOString(),
        apiEndpoint: "https://api.coze.cn/v1/workflow/stream_run",
        requestHeaders: {
          "Authorization": "Bearer cztei_hQDxl4BqtMbaiyBeDhIsEqeaVXnNMg2CpmpxuzoBxcXKWL55IKWc6LhwYJF8OWWby",
          "Content-Type": "application/json",
        },
        requestBody: {
          workflow_id: "7552453818337689652",
          parameters: {
            img: imageUrl,
            promptType: "flux",
            userQuery: "描述一下这张图片"
          }
        },
        responseStatus: response.status,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        responseBody: responseText,
      };

      setDebugInfo(debugInfo);

      if (!response.ok) {
        throw new Error(`API错误: ${response.status} - ${responseText}`);
      }

      // 解析响应
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        const lines = responseText.split('\n').filter(line => line.trim());
        const lastLine = lines[lines.length - 1];
        if (lastLine) {
          result = JSON.parse(lastLine);
        }
      }

      if (result?.data?.output) {
        // 解析内部JSON数据
        const data = JSON.parse(result.data);
        setGeneratedPrompt(data.output);
        toast({
          title: "分析成功",
          description: `耗时: ${endTime - startTime}ms`,
        });
      } else {
        setGeneratedPrompt("分析完成，但未获取到提示词内容");
        toast({
          title: "分析完成",
          description: "请查看调试信息",
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

  const analyzeImage = () => {
    if (!imageUrl) {
      toast({
        title: "请输入图片URL",
        description: "请先输入要分析的图片链接",
        variant: "destructive",
      });
      return;
    }

    if (useMockMode) {
      mockAnalyze();
    } else {
      realAnalyze();
    }
  };

  const copyDebugInfo = () => {
    if (debugInfo) {
      const debugText = JSON.stringify(debugInfo, null, 2);
      navigator.clipboard.writeText(debugText);
      toast({
        title: "已复制",
        description: "调试信息已复制到剪贴板",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Coze API 调试面板
          </CardTitle>
          <CardDescription>
            测试和调试Coze图片逆推提示词功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 模式切换 */}
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useMockMode}
                onChange={(e) => setUseMockMode(e.target.checked)}
                className="rounded"
              />
              使用模拟模式
            </Label>
            {useMockMode ? (
              <div className="flex items-center gap-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">模拟模式 - 不会发送真实API请求</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">真实API模式</span>
              </div>
            )}
          </div>

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
                onClick={() => navigator.clipboard.writeText(generatedPrompt)}
              >
                <Copy className="h-4 w-4 mr-2" />
                复制提示词
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 调试信息 */}
      {debugInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>调试信息</span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyDebugInfo}
              >
                <Copy className="h-4 w-4 mr-2" />
                复制调试信息
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>API端点</Label>
                <div className="p-2 bg-muted rounded text-sm font-mono break-all">
                  {debugInfo.apiEndpoint}
                </div>
              </div>
              
              <div>
                <Label>响应状态</Label>
                <div className={`p-2 rounded text-sm font-mono ${
                  debugInfo.responseStatus === 200 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {debugInfo.responseStatus}
                </div>
              </div>

              <div>
                <Label>请求头</Label>
                <div className="p-2 bg-muted rounded text-sm font-mono max-h-32 overflow-auto">
                  {JSON.stringify(debugInfo.requestHeaders, null, 2)}
                </div>
              </div>

              <div>
                <Label>请求体</Label>
                <div className="p-2 bg-muted rounded text-sm font-mono max-h-32 overflow-auto">
                  {JSON.stringify(debugInfo.requestBody, null, 2)}
                </div>
              </div>

              <div>
                <Label>响应头</Label>
                <div className="p-2 bg-muted rounded text-sm font-mono max-h-32 overflow-auto">
                  {JSON.stringify(debugInfo.responseHeaders, null, 2)}
                </div>
              </div>

              <div>
                <Label>响应体</Label>
                <div className="p-2 bg-muted rounded text-sm font-mono max-h-64 overflow-auto break-all">
                  {typeof debugInfo.responseBody === 'string' 
                    ? debugInfo.responseBody 
                    : JSON.stringify(debugInfo.responseBody, null, 2)
                  }
                </div>
              </div>

              {debugInfo.error && (
                <div>
                  <Label className="text-red-600">错误信息</Label>
                  <div className="p-2 bg-red-50 text-red-800 rounded text-sm">
                    {debugInfo.error}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}