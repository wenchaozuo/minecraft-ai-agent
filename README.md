# 🎮 Minecraft Autonomous AI Agent

A Minecraft intelligent agent powered by Large Language Models (LLM) that receives natural language instructions and autonomously plans/executes complex in-game tasks without step-by-step human guidance.

---

## 🧠 Core Capabilities

| Capability | Description |
|------------|-------------|
| Natural Language Understanding | Accepts Chinese/English instructions, automatically parses intent |
| Autonomous Task Planning | Decomposes complex instructions into executable atomic action sequences |
| Environment Perception | Real-time scanning of blocks, entities, threats, and resource status |
| Memory System | Three-tier memory (short-term/long-term/knowledge) maintains cross-turn context |
| Autonomous Decision Making | Reasoning and action based on ReAct paradigm |
| Automatic Feedback | Death respawn, hunger management, execution result verification |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│           User Natural Language         │
│     "Collect 10 wood and craft a       │
│      crafting table"                    │
└────────────────┬────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│      AI Brain Layer (Python Flask)      │
│  ┌─────────────────────────────────┐    │
│  │   LLM Parsing → Structured      │    │
│  │   Action JSON                    │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │   Memory System / Goal Planner  │    │
│  └─────────────────────────────────┘    │
└────────────────┬────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│    Execution Layer (Node.js + Mineflayer)│
│  ┌─────┬─────┬─────┬─────┬─────┐      │
│  │Navigate│Combat│Mine │Place│Items│...│
│  └─────┴─────┴─────┴─────┴─────┘      │
└─────────────────────────────────────────┘
```

### Dual-Process Architecture

- **Execution Layer**: Node.js + Mineflayer v4.36, connects to Minecraft server, responsible for in-game action execution
- **AI Brain Layer**: Python Flask (listening on `:5000`), integrates LLM for decision-making, currently using DeepSeek-v3.2
- **Communication**: HTTP REST (JS → Python)

---

## 📁 Project Structure

```
minecraft-ai-agent/
├── js/                   # Node.js execution layer
│   ├── bot.js            # Main entry point
│   ├── communication/    # Chat handling / API communication
│   ├── core/             # Action manager / Action executor
│   ├── perception/       # Environment scanning (blocks/entities)
│   ├── skill/            # 9 atomic skill modules
│   ├── feedback/         # Death respawn / Movement monitoring
│   └── state/            # Bot state snapshot
├── python/               # Python AI layer
│   ├── server.py         # Flask service (/chat endpoint)
│   └── brain.py         # Reserved extension entry point
├── design-docs/          # Architecture design documents (6 docs)
│   ├── overall-architecture-design.md
│   ├── perception-layer-upgrade-design.md
│   ├── memory-system-design.md
│   ├── goal-planner-design.md
│   ├── autonomous-decision-loop-design.md
│   └── reflection-self-correction-design.md
└── textures/             # Game texture resources
```

---

## 🚀 Quick Start

### Requirements

- Node.js ≥ 18
- Python ≥ 3.8
- Minecraft server (supports 1.16+)

### Install Dependencies

```bash
# Node.js dependencies
npm install mineflayer prismarine-viewer

# Python dependencies
pip install flask requests
```

### Launch

```bash
# 1. Start AI brain layer
cd python
python server.py

# 2. Start Bot execution layer (new terminal)
cd js
node bot.js
```

---

## 📊 Current Progress

- [x] Core framework development complete (perception-decision-execution-feedback loop)
- [x] 9 atomic skill modules implemented
- [x] Busy lock concurrency prevention mechanism
- [x] Automatic death respawn
- [x] Automatic hunger management (eating when hungry)
- [x] prismarine-viewer 3D visualization
- [x] 6 detailed architecture design documents
- [ ] brain.py active planning module (in design)
- [ ] Memory system persistence
- [ ] Reflection and self-correction mechanism

---

## 🎯 Typical Use Cases

| Instruction | Agent Behavior |
|-------------|----------------|
| "Collect 10 wood" | Autonomous navigation → Find trees → Mine wood → Confirm quantity |
| "Craft a wooden pickaxe" | Check inventory → Collect wood → Open crafting interface → Craft pickaxe |
| "Attack nearby zombies" | Scan entities → Locate zombie → Navigate closer → Attack |
| "Build a 5x5 platform" | Plan platform coordinates → Collect blocks → Place block by block → Complete construction |

---

## 📄 Design Documents

Detailed architecture design documents are located in the `design-docs/` directory, covering:

1. **Overall Architecture Design** — System overview and module decomposition
2. **Perception Layer Upgrade Design** — Environment perception solution
3. **Memory System Design** — Three-tier memory architecture
4. **Goal Planner Design** — Tech tree and task decomposition
5. **Autonomous Decision Loop Design** — ReAct decision loop
6. **Reflection and Self-Correction Design** — Failure analysis and strategy adjustment

---

## 📌 About This Project

This project explores combining Large Language Models with game agents, enabling AI to truly understand player intent and autonomously complete tasks. Welcome to exchange ideas and discussions!

> Currently using DeepSeek-v3.2 as the LLM backend, planning to migrate to more domestic large models.
>
> 🔗 Online Repository: https://github.com/wenchaozuo/minecraft-ai-agent

---

## 📝 License

MIT License — free to use, modify, and distribute.
