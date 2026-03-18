"use client";

import { useState } from 'react';
import { summarizeVisitReasons, SummarizeVisitReasonsOutput } from '@/ai/flows/summarize-visit-reasons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2, RefreshCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIInsightsProps {
  reasons: string[];
}

export default function AIInsights({ reasons }: AIInsightsProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummarizeVisitReasonsOutput | null>(null);

  const generateInsights = async () => {
    if (reasons.length === 0) return;
    setLoading(true);
    try {
      const output = await summarizeVisitReasons({ visitReasons: reasons });
      setResult(output);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-100 shadow-sm bg-blue-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Insights
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateInsights} 
            disabled={loading || reasons.length === 0}
            className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-100/50"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
          </Button>
        </div>
        <CardTitle className="text-lg font-bold">Analysis</CardTitle>
        <CardDescription className="text-xs">
          Smart patterns from visitor logs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <p className="text-xs text-slate-500 font-medium">Analyzing data...</p>
          </div>
        ) : result ? (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
              <h4 className="font-bold text-[10px] uppercase tracking-wider text-blue-600 mb-1">Summary</h4>
              <p className="text-xs leading-relaxed text-slate-600">{result.overallSummary}</p>
            </div>
            
            <div className="space-y-2">
              {result.categorizedReasons.slice(0, 3).map((cat, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter block mb-1">
                    {cat.category}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.reasons.slice(0, 2).map((r, i) => (
                      <span key={i} className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-full text-slate-600 border border-slate-100">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-blue-100 rounded-xl bg-white/50">
            <p className="text-xs text-slate-400 max-w-[160px]">
              Click the refresh icon to generate AI-powered visit insights.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}