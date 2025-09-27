// 使用Coze官方JavaScript SDK测试
import { CozeAPI } from '@coze/api';

async function testCozeWorkflow() {
  console.log('🚀 使用Coze官方SDK测试工作流API...\n');
  
  try {
    // 创建API客户端
    const apiClient = new CozeAPI({
      token: 'cztei_hQDxl4BqtMbaiyBeDhIsEqeaVXnNMg2CpmpxuzoBxcXKWL55IKWc6LhwYJF8OWWby',
      baseURL: 'https://api.coze.cn'
    });

    console.log('📋 请求参数:');
    console.log('- Workflow ID: 7552453818337689652');
    console.log('- Image URL: https://p3-bot-workflow-sign.byteimg.com/tos-cn-i-mdko3gqilj/1ee21c36a6594189b14d9a97a966cd71.png~tplv-mdko3gqilj-image.image?rk3s=81d4c505&x-expires=1789567383&x-signature=rF85ZnwKEBRulXSmjv%2BAssaBvGo%3D&x-wf-file_name=yunling_tcm_avatar_studious_20250912024557_1+%282%29.png');
    console.log('- Prompt Type: flux');
    console.log('- User Query: 描述一下这张图片\n');

    // 调用工作流API
    const res = await apiClient.workflows.runs.create({
      workflow_id: '7552453818337689652',
      parameters: {
        "img": "https://p3-bot-workflow-sign.byteimg.com/tos-cn-i-mdko3gqilj/1ee21c36a6594189b14d9a97a966cd71.png~tplv-mdko3gqilj-image.image?rk3s=81d4c505&x-expires=1789567383&x-signature=rF85ZnwKEBRulXSmjv%2BAssaBvGo%3D&x-wf-file_name=yunling_tcm_avatar_studious_20250912024557_1+%282%29.png",
        "promptType": "flux",
        "userQuery": "描述一下这张图片"
      },
    });

    console.log('✅ 成功响应:');
    console.log(JSON.stringify(res, null, 2));
    
    // 检查响应结构
    if (res && res.data) {
      console.log('\n📝 提取的提示词:');
      console.log(res.data);
    }

  } catch (error) {
    console.error('❌ API调用失败:');
    console.error('错误类型:', error.constructor.name);
    console.error('错误信息:', error.message);
    
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    
    if (error.code) {
      console.error('错误代码:', error.code);
    }
  }
}

// 执行测试
testCozeWorkflow();