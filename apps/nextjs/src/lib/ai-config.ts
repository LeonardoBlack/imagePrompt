import { z } from "zod";

// API响应格式定义
export const ImageAnalysisResponseSchema = z.object({
  prompt: z.string(),
  confidence: z.number().optional(),
  style: z.string().optional(),
  subject: z.string().optional(),
  colors: z.array(z.string()).optional(),
});

export const ImageGenerationResponseSchema = z.object({
  imageUrl: z.string(),
  prompt: z.string(),
  model: z.string().optional(),
  size: z.string().optional(),
});

export const ErrorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
});

// 支持的AI模型
export const SUPPORTED_MODELS = {
  IMAGE_ANALYSIS: [
    { id: "gpt-4-vision", name: "GPT-4 Vision", provider: "openai" },
    { id: "claude-3-vision", name: "Claude 3 Vision", provider: "anthropic" },
  ],
  IMAGE_GENERATION: [
    { id: "dall-e-3", name: "DALL-E 3", provider: "openai" },
    { id: "stable-diffusion", name: "Stable Diffusion", provider: "stability" },
    { id: "midjourney", name: "Midjourney", provider: "midjourney" },
  ],
} as const;

// 图片生成参数
export const GENERATION_CONFIG = {
  sizes: ["1024x1024", "1024x1792", "1792x1024"] as const,
  qualities: ["standard", "hd"] as const,
  styles: ["vivid", "natural"] as const,
};

// 文件上传限制
export const UPLOAD_LIMITS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  maxWidth: 2048,
  maxHeight: 2048,
};

// API端点
export const API_ENDPOINTS = {
  REVERSE_PROMPT: "/api/reverse-prompt",
  GENERATE_IMAGE: "/api/generate-image",
  UPLOAD_IMAGE: "/api/upload-image",
} as const;