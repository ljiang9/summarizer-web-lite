// test_sum.mjs — 提取摘要纯函数 Node 断言。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import assert from "node:assert";

const here = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(here, "index.html"), "utf-8");
const m = html.match(/\/\/ ===== 纯函数：提取式摘要[\s\S]*?\/\/ ===== SUM_LOGIC_END =====/);
assert.ok(m, "未找到摘要纯函数标记");
const f = new Function(`${m[0]}\nreturn { splitSentences, summarize };`)();

const text = "今天天气很好。向量检索是一种方法。向量检索用相似度召回。我们去散步。";
const sents = f.splitSentences(text);
assert.strictEqual(sents.length, 4);

const out = f.summarize(text, 0.5);
// 50% -> 选 2 句，且保持原文顺序
assert.ok(out.includes("向量检索"), "应选高分句（含重复术语）");

// 单句直接返回
assert.strictEqual(f.summarize("只有一句。", 0.5), "只有一句。");

console.log("OK: summarizer-web-lite 全部用例通过");