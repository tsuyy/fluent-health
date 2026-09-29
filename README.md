# Fluent

### What the numbers don't tell you.

> An interpretive system for making sense of longitudinal health data — without pretending to understand your life better than you do.

**Live:** [fluent.yvntsu.design](https://fluent.yvntsu.design)

---

## What this is

Fluent is an HCI case study exploring a question that emerged from four years of my own health data:

> **How can an interpretive system help people notice meaningful patterns in their bodies — without claiming to understand their lives better than they do?**

The project began as a single-subject self-study using Apple Watch data, blood biomarkers, and manually annotated life context. The data surfaced patterns I could not see in individual measurements, but it also exposed the limits of interpreting one person's body from one person's perspective.

I then conducted generative interviews with ten participants and interviews with three clinical experts to test the assumptions behind the system.

The research changed the product substantially — from explaining health metrics to surfacing observations, asking questions, and making uncertainty visible.

---

## What the self-study revealed

Four years of longitudinal data surfaced patterns that were invisible at the level of individual measurements:

- **A 13-day physiological arc before a fever peak** — HRV, RHR, and wrist temperature shifted before symptoms became obvious. Read backward, the pattern is striking; in real time, it was ambiguous.
- **Tennis as the strongest recovery signal in this dataset** — across 33 sessions, HRV peaked two days after tennis at **+4.2ms above personal baseline**.
- **Four years of cardiovascular adaptation** — resting heart rate fell 4.5 bpm while HRV improved 23.8%, with VO₂ max following a nonlinear trajectory through different phases of training.

These findings were not treated as conclusions. They became research questions.

A sample size of one could show me what happened to my body. It could not tell me whether my interpretation would make sense to anyone else.

---

## Primary research

I conducted **12 research sessions with 13 people**:

- **10 participants** across health-engaged wearable users in their 30s–40s and retired adults 60+ focused on maintaining specific capabilities
- **3 clinical experts** — an ICU nurse and two anesthesiologists
- One participant session included two participants together, resulting in **9 participant sessions involving 10 participants**

Generative interviews explored how people currently make sense of their health data, what they trust, and how they relate physiological information to their lived experience.

Expert interviews examined questions around personal baselines, signal confidence, interpretation, and the risks of overclaiming in health contexts.

---

## What research changed

Research didn't simply validate the assumptions behind Fluent. It forced several of them to change.

### Answer-first → Question-first

I initially imagined Fluent interpreting the data and telling the user what it meant.

Participants showed how easily an interpretation can be dismissed when it conflicts with felt experience.

**Fluent now leads with an observation, then invites reflection and verification rather than delivering a verdict.**

### Data literacy → Personal relevance

I assumed better explanations would close the gap between measurement and understanding.

Research showed that even highly sophisticated users can ask:

> “Why are you telling me this?”

**The system therefore connects signals to a person's own patterns and context rather than simply explaining metrics.**

### Annotation friction → Annotation ownership

I initially treated annotation as a UX-friction problem: make it fast enough that people will do it.

Research suggested the deeper issue was ownership. People already record meaningful context elsewhere; Fluent should not require them to become full-time data annotators.

**Passive data comes first. Annotation enriches the interpretation but never gatekeeps it.**

### One long-term frame → Different future selves

I initially framed Fluent around connecting today's choices to a future self decades away.

Research revealed substantially different relationships to the future — including people who actively avoid thinking that far ahead.

**Fluent should meet people inside their own time horizon rather than imposing one.**

### More insight → Conservative, trustworthy silence

I assumed more useful insights would make the system more valuable.

Research showed that trust is fragile: a single interpretation that conflicts with lived experience can undermine several accurate ones.

**Fluent therefore favors accuracy over volume. “Nothing stands out” can be a meaningful result.**

---

## The system

Fluent combines:

- **Longitudinal personal data** — Apple HealthKit activity, heart rate, HRV, sleep, wrist temperature, and VO₂ max
- **Clinical data** — 101 biomarkers across two Function Health panels
- **Lived context** — manually annotated travel, training, illness, recovery, and other life events
- **Personal baselines** — measurements interpreted relative to an individual's own historical patterns rather than population averages
- **An interpretive layer** — connecting signals without treating correlation as certainty
- **An interactive React prototype** — demonstrating the resulting experience across different people and amounts of available data

The current prototype is a **pull-based exploration tool**. Users navigate to their data and explore what Fluent notices; event-driven delivery and conversational interaction remain future design directions rather than implemented functionality.

---

## Data & methodology

Data collection spans **January 2022–present**.

### Passive sensing

- 723K+ heart-rate readings
- 7,600+ HRV readings
- 1,600+ RHR readings
- 600+ VO₂ max estimates
- 17,000+ sleep-stage records
- 260+ days of wrist-temperature data

### Activity

- 1,700+ workout sessions
- 10 sport types
- 6,900+ logged miles
- 1,800+ hours of activity

### Clinical

- 101 biomarkers
- 2 blood draws
- 8 biomarker categories

### Lived context

- 30+ annotated life events
- 16 ski trips
- 2 illness events with full physiological arcs

HealthKit data was parsed and processed with Python and pandas. Blood-panel PDFs were processed locally with Python. Personal baselines are calculated from an individual's historical data rather than population reference ranges.

All health data remains local and is excluded from the repository.

---

## A note on n=1

The self-study is not a population study.

Its findings describe one body, one life, and one person's relationship to their data. The purpose was not to prove that these patterns generalize, but to use longitudinal self-study as a way to discover questions that would otherwise remain invisible.

Primary research then tested those questions against other people's experiences.

The resulting system is therefore less about predicting what a body will do and more about exploring **how people interpret signals about their own bodies — and what happens when those signals conflict with what they already believe.**

---

## Case study structure

1. **The problem** — measurement is not the same as understanding
2. **What self-study revealed** — patterns that surfaced from four years of data
3. **The data behind it** — sources, processing, baselines, and limitations
4. **Primary research** — participants, methodology, and assumption mapping
5. **The demo** — how research findings changed the system
6. **Reflection** — what Fluent still cannot know and the questions worth pursuing next

---

## Privacy

All personal health data is processed locally and is **not committed to this repository**.

Charts and visualizations use real findings, but the underlying health-data files remain private.

Research participant data is anonymized and is not included in this repository.

---

## Built with

**Python · pandas · React · Framer Motion · Apple HealthKit · Function Health**

---

*Built as a portfolio case study for UX research, HCI, and health technology applications.*

*Data collection: January 2022–present.*