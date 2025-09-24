"use client";

import { useState } from "react";
import { Button } from "@saasfly/ui/button";
import { Input } from "@saasfly/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@saasfly/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@saasfly/ui";
import { Upload, Wand2, Download, Sparkles, Copy } from "lucide-react";
import * as Icons from "lucide-react";

interface AIToolHeroProps {
  dict?: any;
}

export function AIToolHero({ dict }: AIToolHeroProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("reverse");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReversePrompt = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    try {
      // 这里集成AI图片逆推API
      const response = await fetch("/api/reverse-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imagePreview,
        }),
      });
      
      const data = await response.json();
      setPrompt(data.prompt || "AI生成的提示词将显示在这里...");
    } catch (error) {
      console.error("逆推失败:", error);
      setPrompt("逆推失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      // 这里集成AI图片生成API
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });
      
      const data = await response.json();
      setGeneratedImage(data.imageUrl || "/api/placeholder/400/400");
    } catch (error) {
      console.error("生成失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container py-12">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-purple-500" />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI图片工具站
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          上传图片，AI智能逆推提示词；输入描述，AI生成精美图片
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
            立即体验
            <Icons.ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            查看教程
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="reverse" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              图片逆推提示词
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              AI生成图片
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reverse" className="space-y-6">
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">上传图片</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      {imagePreview ? (
                        <img src={imagePreview} alt="预览" className="max-w-full h-48 object-cover mx-auto rounded-lg" />
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-600">点击上传图片或拖拽到此处</p>
                        </div>
                      )}
                    </label>
                  </div>
                  <Button 
                    onClick={handleReversePrompt} 
                    disabled={!selectedImage || isLoading}
                    className="w-full"
                  >
                    {isLoading ? "AI分析中..." : "逆推提示词"}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">生成的提示词</h3>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="AI生成的提示词将显示在这里..."
                    className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    readOnly={isLoading}
                  />
                  <Button variant="outline" className="w-full" disabled={!prompt}>
                    <Copy className="h-4 w-4 mr-2" />
                    复制提示词
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-6">
            <Card className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">输入描述</h3>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="描述你想要生成的图片，例如：一只可爱的猫咪在花园里玩耍..."
                    className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button 
                    onClick={handleGenerateImage} 
                    disabled={!prompt.trim() || isLoading}
                    className="w-full"
                  >
                    {isLoading ? "生成中..." : "生成图片"}
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">生成的图片</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                    {generatedImage ? (
                      <img src={generatedImage} alt="生成的图片" className="max-w-full h-auto rounded-lg" />
                    ) : (
                      <div className="text-center text-gray-500">
                        <Wand2 className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">生成的图片将显示在这里</p>
                      </div>
                    )}
                  </div>
                  {generatedImage && (
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      下载图片
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 功能特色 */}
      <div className="mt-16 grid md:grid-cols-3 gap-8">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Upload className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">智能图片分析</h3>
          <p className="text-muted-foreground">上传图片，AI自动分析并生成详细的提示词</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Wand2 className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">高质量图片生成</h3>
          <p className="text-muted-foreground">输入描述，AI生成高质量、创意十足的图片</p>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">简单易用</h3>
          <p className="text-muted-foreground">直观的界面设计，让AI工具触手可及</p>
        </Card>
      </div>
    </section>
  );
}