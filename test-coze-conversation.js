// 测试Coze对话API
async function testCozeConversationAPI() {
  const API_BASE = "https://api.coze.com";
  const TOKEN = "cztei_qOazV6mchuUguv4HCYopPce7A8RItrPlVdI9hQvNHFUM4JZjcz3N6BiMoENPBR1J4";
  
  const testImageUrl = "https://p3-bot-workflow-sign.byteimg.com/tos-cn-i-mdko3gqilj/1ee21c36a6594189b14d9a97a966cd71.png~tplv-mdko3gqilj-image.image?rk3s=81d4c505&x-expires=1789567383&x-signature=rF85ZnwKEBRulXSmjv%2BAssaBvGo%3D&x-wf-file_name=yunling_tcm_avatar_studious_20250912024557_1+%282%29.png";
  
  console.log("🧪 测试Coze对话创建API...");
  console.log("🖼️  图片URL:", testImageUrl);
  
  try {
    // 创建对话
    const response = await fetch(`${API_BASE}/v1/conversation/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        bot_id: "7382952427052894242", // 使用默认bot ID
        user_id: "user_123456",
        additional_messages: [
          {
            role: "user",
            content: `请分析这张图片并生成详细的AI绘图提示词: ${testImageUrl}`,
            content_type: "text"
          }
        ]
      }),
    });

    console.log("📡 响应状态:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API错误:", errorText);
      return;
    }

    const data = await response.json();
    console.log("✅ 成功响应:", JSON.stringify(data, null, 2));
    
    // 检查响应结构
    if (data.conversation_id) {
      console.log("🎯 对话创建成功，ID:", data.conversation_id);
      
      // 尝试获取对话内容
      if (data.messages && data.messages.length > 0) {
        const botReply = data.messages.find((msg) => msg.role === 'assistant');
        if (botReply) {
          console.log("🤖 Bot回复:", botReply.content);
        }
      }
    } else {
      console.log("⚠️  未找到对话ID，完整响应:", data);
    }
    
  } catch (error) {
    console.error("💥 请求失败:", error);
  }
}

// 运行测试
testCozeConversationAPI();