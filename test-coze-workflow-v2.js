// 测试Coze工作流API - 使用正确的参数格式
async function testCozeWorkflowCorrect() {
  const API_BASE = "https://api.coze.com";
  const TOKEN = "cztei_qOazV6mchuUguv4HCYopPce7A8RItrPlVdI9hQvNHFUM4JZjcz3N6BiMoENPBR1J4";
  const WORKFLOW_ID = "7552453818337689652";
  
  const testImageUrl = "https://p3-bot-workflow-sign.byteimg.com/tos-cn-i-mdko3gqilj/1ee21c36a6594189b14d9a97a966cd71.png~tplv-mdko3gqilj-image.image?rk3s=81d4c505&x-expires=1789567383&x-signature=rF85ZnwKEBRulXSmjv%2BAssaBvGo%3D&x-wf-file_name=yunling_tcm_avatar_studious_20250912024557_1+%282%29.png";
  
  console.log("🧪 测试Coze工作流API（修正版）...");
  console.log("📋 工作流ID:", WORKFLOW_ID);
  console.log("🖼️  图片URL:", testImageUrl);
  
  try {
    const response = await fetch(`${API_BASE}/v1/workflow/stream_run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        workflow_id: WORKFLOW_ID,
        parameters: {
          img: testImageUrl,
          promptType: "flux",
          userQuery: "描述一下这张图片"
        }
      }),
    });

    console.log("📡 响应状态:", response.status);
    console.log("📡 响应头:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API错误:", errorText);
      
      // 尝试解析错误信息
      try {
        const errorJson = JSON.parse(errorText);
        console.error("📋 错误详情:", errorJson);
      } catch (e) {
        console.error("📄 原始错误文本:", errorText);
      }
      return;
    }

    const data = await response.json();
    console.log("✅ 成功响应:", JSON.stringify(data, null, 2));
    
    // 检查响应结构
    if (data.data?.output) {
      console.log("🎯 生成的提示词:", data.data.output);
    } else if (data.output) {
      console.log("🎯 生成的提示词:", data.output);
    } else {
      console.log("⚠️  未找到输出数据，完整响应:", data);
    }
    
  } catch (error) {
    console.error("💥 请求失败:", error);
  }
}

// 运行测试
testCozeWorkflowCorrect();