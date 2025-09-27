"use client";

import { useState } from "react";
import { Button } from "@saasfly/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saasfly/ui/card";
import { Input } from "@saasfly/ui/input";
import { Label } from "@saasfly/ui/label";
import { Textarea } from "@saasfly/ui/textarea";
import { useToast } from "@saasfly/ui/use-toast";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { api } from "~/trpc/client";

interface ImageAnalyzerProps {
  onPromptGenerated?: (prompt: string) => void;
}

export function ImageAnalyzer({ onPromptGenerated }: ImageAnalyzerProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
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
    try {
      // 使用用户提供的工作流ID
      const result = await api.coze.analyzeImage.mutate({
        imageUrl,
        workflowId: "7552453818337689652", // 用户提供的固定工作流ID
      });

      if (result.success && result.prompt) {
        setGeneratedPrompt(result.prompt);
        onPromptGenerated?.(result.prompt);
        toast({
          title: "分析成功",
          description: "图片提示词已生成",
        });
      } else {
        toast({
          title: "分析失败",
          description: result.error || "未知错误",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("图片分析错误:", error);
      toast({
        title: "分析失败",
        description: "网络请求失败，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 这里可以实现图片上传到云存储的逻辑
      // 暂时显示文件名
      toast({
        title: "图片已选择",
        description: `已选择文件: ${file.name}`,
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          图片AI分析器
        </CardTitle>
        <CardDescription>
          上传图片或输入图片URL，AI将为您生成详细的绘图提示词
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {/* 文件上传 */}
        <div className="space-y-2">
          <Label htmlFor="imageUpload">或上传图片</Label>
          <div className="flex items-center gap-2">
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isAnalyzing}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('imageUpload')?.click()}
              disabled={isAnalyzing}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              选择图片
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
            <Label htmlFor="generatedPrompt">生成的提示词</Label>
            <Textarea
              id="generatedPrompt"
              value={generatedPrompt}
              readOnly
              rows={6}
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(generatedPrompt);
                toast({
                  title: "已复制",
                  description: "提示词已复制到剪贴板",
                });
              }}
            >
              复制提示词
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}