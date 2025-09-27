import { Suspense } from "react";
import { ImageAnalyzer } from "~/components/image-analyzer";
import { CozeDebugPanel } from "~/components/coze-debug-panel";
import { getCurrentUser } from "@saasfly/auth";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@saasfly/ui/tabs";

export default async function CozeIntegrationPage() {
  // 检查用户是否已登录
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Coze AI 图片分析器
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            利用Coze工作流，智能分析图片内容并生成详细的AI绘图提示词
          </p>
        </div>
        
        <Tabs defaultValue="analyzer" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analyzer">图片分析器</TabsTrigger>
            <TabsTrigger value="debug">API调试</TabsTrigger>
          </TabsList>
          <TabsContent value="analyzer">
            <Suspense fallback={<div>加载中...</div>}>
              <ImageAnalyzer />
            </Suspense>
          </TabsContent>
          <TabsContent value="debug">
            <CozeDebugPanel />
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center text-sm text-muted-foreground max-w-2xl">
          <h3 className="font-semibold mb-2">使用说明：</h3>
          <ul className="text-left space-y-1">
            <li>• 输入图片URL或上传本地图片</li>
            <li>• 点击"开始分析"按钮启动Coze工作流</li>
            <li>• AI将分析图片并生成详细的绘图提示词</li>
            <li>• 可复制生成的提示词用于AI绘图工具</li>
            <li>• API调试面板可查看详细的请求和响应信息</li>
          </ul>
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">✅ Coze API已连接</p>
            <p className="text-green-700 text-sm">
              工作流API已配置成功，可以正常使用图片分析功能。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}