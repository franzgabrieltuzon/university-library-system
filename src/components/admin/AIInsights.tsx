
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
    <Card className="border-accent/30 shadow-lg bg-gradient-to-br from-white to-accent/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-headline font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            AI Visit Analysis
          </CardTitle>
          <CardDescription>
            Pattern detection from unstructured visitor reasons.
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={generateInsights} 
          disabled={loading || reasons.length === 0}
          className="bg-white"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
          {result ? 'Refresh Analysis' : 'Generate Analysis'}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
            <p className="text-muted-foreground animate-pulse">Gemini is analyzing {reasons.length} visit logs...</p>
          </div>
        ) : result ? (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="bg-white/50 p-4 rounded-lg border border-accent/20">
              <h4 className="font-bold text-sm uppercase tracking-wider text-accent mb-2">Overall Summary</h4>
              <p className="text-sm leading-relaxed">{result.overallSummary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.categorizedReasons.map((cat, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border shadow-sm">
                  <Badge variant="secondary" className="mb-2 bg-accent/10 text-accent border-accent/20">
                    {cat.category}
                  </Badge>
                  <ScrollArea className="h-24">
                    <ul className="text-xs space-y-1 text-muted-foreground list-disc pl-4">
                      {cat.reasons.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </ScrollArea>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-white/30 rounded-lg border border-dashed">
            <Sparkles className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">
              {reasons.length > 0 
                ? `Ready to analyze ${reasons.length} visitor reasons.` 
                : "No visitor data available for analysis."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
