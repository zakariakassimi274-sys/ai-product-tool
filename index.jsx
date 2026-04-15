import { useState } from "react";

const tones = ["احترافي", "ودّي وجذاب", "فاخر وراقي", "مقنع وتسويقي", "بسيط ومباشر"];
const platforms = ["متجر سلة", "متجر زد", "أمازون", "إنستغرام", "عام"];
const outputTypes = [
  { id: "desc", label: "وصف المنتج", icon: "📝" },
  { id: "ad", label: "إعلان سوشيال ميديا", icon: "📢" },
  { id: "title", label: "عنوان المنتج", icon: "✏️" },
  { id: "bullets", label: "نقاط المميزات", icon: "✅" },
];

export default function App() {
  const [form, setForm] = useState({ name: "", category: "", price: "", features: "", tone: "احترافي", platform: "عام", lang: "العربية" });
  const [selectedOutputs, setSelectedOutputs] = useState(["desc"]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

  const toggleOutput = (id) => setSelectedOutputs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const generate = async () => {
    if (!form.name.trim()) { setError("أدخل اسم المنتج أولاً"); return; }
    setError(null); setLoading(true); setResults(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `اكتب ${selectedOutputs.map(id => outputTypes.find(o => o.id === id)?.label).join("، ")} للمنتج: ${form.name}. الفئة: ${form.category}. السعر: ${form.price}. المميزات: ${form.features}. الأسلوب: ${form.tone}. المنصة: ${form.platform}. اللغة: ${form.lang}. اكتب محتوى احترافي جاهز للنشر.` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("\n") || "";
      if (!text) throw new Error("خطأ");
      setResults(text);
    } catch (e) { setError("حدث خطأ، حاول مرة أخرى"); }
    setLoading(false);
  };

  const copy = (text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(null), 2000); };

  return (
    <div style={{ fontFamily: "Cairo, sans-serif", background: "#f7f3ee", minHeight: "100vh", direction: "rtl", padding: 20 }}>
      <h1 style={{ textAlign: "center", color: "#c8813a", marginBottom: 20 }}>✨ كاتب المنتجات بالذكاء الاصطناعي</h1>
      <div style={{ maxWidth: 600, margin: "0 auto", background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px #0001" }}>
        <input style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #e8e0d5", marginBottom: 12, fontFamily: "Cairo", fontSize: 14 }} placeholder="اسم المنتج *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
        <input style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #e8e0d5", marginBottom: 12, fontFamily: "Cairo", fontSize: 14 }} placeholder="الفئة (مثال: إلكترونيات)" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
        <input style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #e8e0d5", marginBottom: 12, fontFamily: "Cairo", fontSize: 14 }} placeholder="السعر (اختياري)" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} />
        <textarea style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #e8e0d5", marginBottom: 12, fontFamily: "Cairo", fontSize: 14, resize: "vertical" }} rows={3} placeholder="المميزات والتفاصيل" value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))} />
        <select style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #e8e0d5", marginBottom: 12, fontFamily: "Cairo", fontSize: 14 }} value={form.tone} onChange={e => setForm(p => ({ ...p, tone: e.target.value }))}>
          {tones.map(t => <option key={t}>{t}</option>)}
        </select>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {outputTypes.map(o => (
            <button key={o.id} onClick={() => toggleOutput(o.id)} style={{ padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${selectedOutputs.includes(o.id) ? "#c8813a" : "#e8e0d5"}`, background: selectedOutputs.includes(o.id) ? "#fff5ec" : "#fff", color: selectedOutputs.includes(o.id) ? "#c8813a" : "#666", fontFamily: "Cairo", cursor: "pointer", fontSize: 13 }}>
              {o.icon} {o.label}
            </button>
          ))}
        </div>
        {error && <div style={{ background: "#fff0f0", border: "1px solid #ffcdd2", borderRadius: 10, padding: 12, color: "#c62828", marginBottom: 12, fontSize: 14 }}>⚠️ {error}</div>}
        <button onClick={generate} disabled={loading} style={{ width: "100%", background: "linear-gradient(135deg, #c8813a, #e8a55a)", color: "#fff", border: "none", borderRadius: 12, padding: 14, fontFamily: "Cairo", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "⏳ جاري التوليد..." : "🚀 ولّد المحتوى"}
        </button>
        {results && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <strong style={{ color: "#2d1f0e" }}>📄 النتيجة</strong>
              <button onClick={() => copy(results)} style={{ background: copied ? "#e8f5e9" : "#f7f3ee", border: "1px solid #e8e0d5", borderRadius: 8, padding: "6px 14px", fontFamily: "Cairo", fontSize: 12, cursor: "pointer", color: copied ? "#388e3c" : "#888" }}>
                {copied ? "✅ تم النسخ!" : "📋 نسخ"}
              </button>
            </div>
            <div style={{ background: "#fdfbf8", border: "1px solid #f0e8df", borderRadius: 10, padding: 16, fontSize: 14, lineHeight: 1.9, whiteSpace: "pre-wrap", color: "#333" }}>{results}</div>
          </div>
        )}
      </div>
    </div>
  );
}
