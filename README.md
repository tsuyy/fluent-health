# fluent-health

# Fluent - what the numbers don't tell you

> Transforming passive health tracking into meaningful self-understanding.

A longitudinal personal health intelligence system built on 4 years of 
Apple Watch data, blood panel biomarkers, and annotated life context.

**Live:** [fluent.yvntsu.design](https://fluent.yvntsu.design)

## What this is

Fluent is a case study and proof-of-concept exploring a core UX question:

*How might AI help people construct meaningful narratives from fragmented 
health data collected at different frequencies and levels of clinical significance?*

Built with Apple Health export data (624K heart rate readings, 1,621 workouts, 
sleep, HRV, VO2 max), two Function Health blood panels (101 biomarkers), 
and a personal annotation layer connecting life events to physiological signals.

## Key findings

- Detected illness 13 days before fever peak using four passive sensors
- Identified tennis as the highest HRV-recovery sport (+4.8ms day after)
- Distinguished contact transmission vs accumulated immune collapse signatures
- Documented a 4-year cardiovascular adaptation arc across four sport modalities
- Generated falsifiable predictions against a midyear blood panel

## The system

- **Python pipeline** — XML parsing, daily aggregation, personal baseline computation
- **Streamlit dashboard** — interactive sport-toggle, illness arc, recovery scoring
- **AI weekly letter** — Claude-powered narrative interpretation with epistemic humility
- **Case study site** — this repo

## Privacy

All health data is processed locally and never committed to this repository. 
Charts and visualizations use the real findings but the underlying data 
files remain private.

## Case study structure

1. The problem — fragmented data, no interpretive layer
2. The data — what was collected and how
3. Findings — fever arc, tennis discovery, four-year adaptation
4. Predictions — blood panel hypotheses made before results
5. The system — design decisions behind each component
6. Reflection — limitations, next questions, implications for health UX

---

*Built as a portfolio piece for UX research and health tech applications.*
*Data collection: Jan 2022 – present.*