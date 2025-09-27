import { Suspense } from "react";
import { ImageAnalyzer } from "~/components/image-analyzer";
import { getCurrentUser } from "@saasfly/auth";
import { redirect } from "next/navigation";

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
        
        <Suspense fallback={<div>加载中...</div>}>
          <ImageAnalyzer />
        </Suspense>

        <div className="mt-12 text-center text-sm text-muted-foreground max-w-2xl">
          <h3 className="font-semibold mb-2">使用说明：</h3>
          <ul className="text-left space-y-1">
            <li>• 输入图片URL或上传本地图片</li>
            <li>• 点击"开始分析"按钮启动Coze工作流</li>
            <li>• AI将分析图片并生成详细的绘图提示词</li>
            <li>• 可复制生成的提示词用于AI绘图工具</li>
          </ul>
        </div>
      </div>
    </div>
  );
}