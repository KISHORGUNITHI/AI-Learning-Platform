---
inclusion: always
---

# Global Rule: Visual Activities in MDX Lessons

This learning platform follows a **Visual-First Learning** philosophy.

## Rule

Whenever an MDX lesson contains a section titled with any of the following:

- 🎨 Visual Activity
- 🔄 Process Flow
- 🏗️ Architecture View
- ⚖️ Comparison View
- 🧠 Mental Model
- 📍 Timeline
- 🌍 Visual Walkthrough

Do **NOT** render it as a plain markdown code block or static text.

Instead, replace it with the most appropriate reusable MDX component from the platform.

## Component Selection Guide

| Content Type | Use Component |
|---|---|
| Step-by-step process / pipeline | `<FlowDiagram steps={[...]} title="..." />` |
| Two-sided contrast | `<Comparison left={{label,points}} right={{label,points}} title="..." />` |
| Token / word → value mapping | `<TokenMapping items={[{from,to}]} title="..." />` |
| Mathematical equation (labelled) | `<MathBlock title="...">$$...$$</MathBlock>` |
| Architecture / system overview | `<FlowDiagram>` with descriptive step labels |
| Before → After transformation | `<Comparison>` with "Before" and "After" sides |

## Available Components (no import needed in MDX)

- `<FlowDiagram steps={[]} title="" />`
- `<TokenMapping items={[{from, to}]} title="" fromLabel="" toLabel="" />`
- `<Comparison left={{label, points: []}} right={{label, points: []}} title="" />`
- `<MathBlock title="">$$...$$</MathBlock>`
- `<InfoCard variant="info|warning|tip|success|error" title="">...</InfoCard>`
- `<Callout>...</Callout>`
- `<DiagramContainer caption="">...</DiagramContainer>`

## Examples

### ❌ Do NOT write:

```text
Tokenizer → Token IDs → Neural Network → Output
```

### ✅ Write instead:

```mdx
<FlowDiagram title="Tokenization Pipeline" steps={[
  "Input Text",
  "Tokenizer",
  "Token IDs",
  "Neural Network",
  "Output"
]} />
```

---

### ❌ Do NOT write:

```text
CPU: Few cores, sequential
GPU: Thousands of cores, parallel
```

### ✅ Write instead:

```mdx
<Comparison
  title="CPU vs GPU"
  left={{ label: "CPU", points: ["Few powerful cores", "Sequential processing"] }}
  right={{ label: "GPU", points: ["Thousands of small cores", "Parallel matrix computation"] }}
/>
```

---

## Important

- The author writes **what** should be taught.
- Kiro decides **how** it should be visualized.
- Always choose the component that best communicates the concept.
- Never output ASCII diagrams or plain code block visualizations in MDX files.
- All components are theme-aware (dark/light) and fully responsive.

## Proactive Visualizations

If a concept can be understood significantly better through a visualization, proactively create one even if the lesson only contains explanatory text.

Use judgment: add a visual when it would meaningfully reduce cognitive load, not just to add decoration.

## Mathematical Function Graphs

Whenever a lesson introduces a mathematical function or equation, render it as a graph using `<FunctionPlot>` instead of (or alongside) the formula whenever it improves understanding.

```mdx
<FunctionPlot fn="relu"              title="ReLU Activation" />
<FunctionPlot fn="gelu"              title="GELU Activation" />
<FunctionPlot fn="sigmoid"           title="Sigmoid Function" />
<FunctionPlot fn="tanh"              title="Tanh Function" />
<FunctionPlot fn="sine"              title="Sine Wave" />
<FunctionPlot fn="loss"              title="Training Loss Curve" xLabel="Steps" yLabel="Loss" />
<FunctionPlot fn={["relu", "gelu"]}  title="ReLU vs GELU" />
```

**When to use FunctionPlot:**
- Activation functions (ReLU, GELU, sigmoid, tanh)
- Sinusoidal positional encoding (sine, cosine)
- Training loss over time (loss)
- Softmax probability distribution
- Any curve that communicates shape / behaviour better than a formula

**Rule:** Always prefer an intuitive graph over a bare equation when explaining what a function *does*. Show the formula with `<MathBlock>` and the graph with `<FunctionPlot>` together.
