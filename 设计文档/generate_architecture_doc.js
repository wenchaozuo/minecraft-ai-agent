const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
        ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
        TableOfContents } = require('docx');
const fs = require('fs');

// 创建边框样式
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

// 无边框
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

// 标题样式
const h1Style = {
    run: { size: 40, bold: true, font: "Arial", color: "1F4E79" },
    paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 }
};

const h2Style = {
    run: { size: 32, bold: true, font: "Arial", color: "2E75B6" },
    paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 }
};

const h3Style = {
    run: { size: 26, bold: true, font: "Arial", color: "3A7AB8" },
    paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 }
};

// 创建文档
const doc = new Document({
    styles: {
        default: {
            document: {
                run: { font: "Arial", size: 24 }
            }
        },
        paragraphStyles: [
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                ...h1Style
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                ...h2Style
            },
            {
                id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
                ...h3Style
            },
            {
                id: "Title", name: "Title", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 64, bold: true, font: "Arial", color: "1F4E79" },
                paragraph: { spacing: { before: 600, after: 300 }, alignment: AlignmentType.CENTER }
            }
        ]
    },
    numbering: {
        config: [
            {
                reference: "bullets",
                levels: [{
                    level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }, {
                    level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 1080, hanging: 360 } } }
                }]
            },
            {
                reference: "numbers",
                levels: [{
                    level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
                    style: { paragraph: { indent: { left: 720, hanging: 360 } } }
                }]
            }
        ]
    },
    sections: [{
        properties: {
            page: {
                size: { width: 11906, height: 16838 },
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
            }
        },
        headers: {
            default: new Header({
                children: [new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [new TextRun({ text: "Minecraft AI Agent \u2014 Architecture Design", italics: true, size: 20, color: "666666" })]
                })]
            })
        },
        footers: {
            default: new Footer({
                children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "Page ", size: 20 }),
                        new TextRun({ children: [PageNumber.CURRENT], size: 20 }),
                        new TextRun({ text: " of ", size: 20 }),
                        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20 })
                    ]
                })]
            })
        },
        children: [
            // 封面
            new Paragraph({ children: [] }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                    text: "Minecraft AI Agent",
                    bold: true, size: 72, font: "Arial", color: "1F4E79"
                })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                    text: "Autonomous Agent Architecture Design",
                    bold: true, size: 48, font: "Arial", color: "2E75B6"
                })]
            }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "v2.0 \u2014 2026.04", size: 28, color: "666666" })]
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "\u2014\u2014 Architecture Document Series \u2014\u2014", size: 24, color: "999999" })]
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Six documents covering perception, memory, planning, decision, and reflection", size: 22, italics: true, color: "888888" })]
            }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [new PageBreak()] }),

            // 目录
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Table of Contents")] }),
            new TableOfContents("Contents", { hyperlink: true, headingStyleRange: "1-3" }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第一章：整体架构设计
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Chapter 1: Overall Architecture Design")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 System Overview")] }),
            new Paragraph({
                children: [new TextRun("The Minecraft AI Agent is a two-layer intelligent system combining a JavaScript execution layer and a Python AI brain layer. The execution layer (Node.js + Mineflayer) is responsible for real-time perception and action execution, while the AI brain layer (Python + Flask + DeepSeek-v3.2) handles high-level planning and decision-making. The two layers communicate via HTTP REST APIs, enabling natural language instruction parsing, autonomous behavior planning, and closed-loop feedback optimization.")],
                spacing: { after: 200 }
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 High-Level Architecture Diagram")] }),

            // 架构图表格
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [9026],
                rows: [
                    new TableRow({
                        children: [new TableCell({
                            borders: { top: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" }, left: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" }, right: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" } },
                            width: { size: 9026, type: WidthType.DXA },
                            shading: { fill: "1F4E79", type: ShadingType.CLEAR },
                            margins: { top: 100, bottom: 100, left: 200, right: 200 },
                            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "JavaScript Execution Layer (Node.js + Mineflayer)", bold: true, size: 24, color: "FFFFFF" })] })]
                        })]
                    }),
                    new TableRow({
                        children: [new TableCell({
                            borders: { top: noBorder, bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" }, right: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" } },
                            width: { size: 9026, type: WidthType.DXA },
                            shading: { fill: "EBF3FB", type: ShadingType.CLEAR },
                            margins: { top: 80, bottom: 80, left: 200, right: 200 },
                            children: [
                                new Paragraph({ children: [new TextRun({ text: "Perception (environment / threat / resources / progress / worldMap / aggregator)", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "Action Execution (navigate / attack / dig / placeBlock / useItem / equip / itemManage / blockInteract / stop)", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "Feedback (death / movement)", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "State (snapshot)", size: 22 })] })
                            ]
                        })]
                    }),
                    new TableRow({
                        children: [new TableCell({
                            borders: { top: { style: BorderStyle.SINGLE, size: 8, color: "2E75B6" }, bottom: { style: BorderStyle.SINGLE, size: 8, color: "2E75B6" }, left: { style: BorderStyle.SINGLE, size: 4, color: "2E75B6" }, right: { style: BorderStyle.SINGLE, size: 4, color: "2E75B6" } },
                            width: { size: 9026, type: WidthType.DXA },
                            shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                            margins: { top: 80, bottom: 80, left: 200, right: 200 },
                            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "HTTP REST \u2192 Python AI Brain Layer", bold: true, size: 24, color: "FFFFFF" })] })]
                        })]
                    }),
                    new TableRow({
                        children: [new TableCell({
                            borders: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" }, left: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" }, right: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" } },
                            width: { size: 9026, type: WidthType.DXA },
                            shading: { fill: "F5F9FD", type: ShadingType.CLEAR },
                            margins: { top: 80, bottom: 80, left: 200, right: 200 },
                            children: [
                                new Paragraph({ children: [new TextRun({ text: "Agent Loop (perception / planning / decision / reflection)", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "Memory System (short-term / long-term / knowledge)", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "Planner (tech tree / goal queue / state analyzer)", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "DeepSeek-v3.2 LLM", size: 22 })] })
                            ]
                        })]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.3 Module Responsibilities")] }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2500, 6526],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Module", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Responsibility", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Perception Layer" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Real-time environment scanning, threat assessment, resource detection, progress tracking, world map management" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Memory System" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Short-term: action sequences and context; Long-term: world state persistence; Knowledge: lessons learned" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Planner" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Technology tree with 40+ goals, goal decomposition and prioritization, state analysis for planning" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Agent Loop" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "ReAct-style decision loop: perceive \u2192 plan \u2192 act \u2192 reflect, continuous autonomous behavior" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Critic / Reflection" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Failure analysis, strategy adjustment, learning from mistakes, continuous self-improvement" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.4 Data Flow")] }),

            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "User sends a natural language instruction (e.g., \"build a wooden house\")" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Agent Loop parses the instruction and generates a goal" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Planner decomposes the goal into sub-goals based on the tech tree" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Perception layer provides current environment state" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "LLM generates the next action using ReAct reasoning" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Execution layer runs the action and returns observation" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Memory system stores the experience; Critic evaluates success/failure" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Loop repeats until goal is achieved or max iterations reached" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.5 Inter-Module Dependencies")] }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [3000, 3000, 3026],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Module A", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Module B", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Data Flow", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Perception Layer" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Agent Loop" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Environment snapshot \u2192 planning context" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Planner" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Tech Tree" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Goal requirements \u2192 dependency check" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Agent Loop" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "LLM" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Context + memory \u2192 action decision" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Critic" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Memory System" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Evaluation result \u2192 experience storage" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Memory System" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Planner" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "World state \u2192 planning feasibility" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第二章：感知层架构
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Chapter 2: Perception Layer Architecture")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Perception Architecture Overview")] }),
            new Paragraph({
                children: [new TextRun("The perception layer is built on the existing scan.js foundation, expanding into six specialized sub-modules. Each module is responsible for a specific aspect of environment understanding, and the Aggregator synthesizes their outputs into a unified semantic state for the AI brain.")],
                spacing: { after: 200 }
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Module Architecture")] }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2000, 3513, 3513],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Module", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Input", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Output", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "environment.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Bot position, time, weather, nearby blocks" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Biome type, terrain type, shelter analysis, danger level" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "threat.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Nearby entities, HP, equipment status" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Threat list (type, distance, severity), escape recommendation" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "resources.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Inventory, nearby blocks, entity drops" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Resource inventory (categorized), nearby resource map" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "progress.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Inventory, structures, tech tree status" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Progress percentage, available goals, bottleneck analysis" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "worldMap.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Explored blocks, bot position history" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Chunk-based map, exploration coverage, home base location" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "aggregator.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Outputs from all five modules" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Unified semantic state snapshot for AI consumption" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 Key Design Decisions")] }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Asynchronous perception: each sub-module runs independently, preventing one slow scan from blocking the entire perception pipeline", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Adaptive scan radius: perception range dynamically adjusts based on current threat level (larger when safe, smaller when in danger)", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Incremental updates: only send changed portions to the AI layer to reduce communication overhead", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Cache invalidation: environment state is cached and only refreshed when the bot moves or significant time passes", bold: false })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.4 Aggregator Interface")] }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [3000, 3000, 3026],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Field", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Type", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "position", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "{x, y, z}" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Bot's current coordinates" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "environment", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "EnvironmentState" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Biome, terrain, shelter, danger" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "threats", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Threat[]" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Sorted by severity" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "resources", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "ResourceInventory" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Organized by material type" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "progress", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "ProgressState" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Percentage, goals, bottlenecks" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "worldMap", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "WorldMap" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Chunks, coverage, home" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第三章：记忆系统架构
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Chapter 3: Memory System Architecture")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Three-Layer Memory Architecture")] }),
            new Paragraph({
                children: [new TextRun("The memory system consists of three layers with distinct characteristics and purposes. Each layer serves a different cognitive function, mirroring the Atkinson-Shiffrin memory model adapted for autonomous agents.")],
                spacing: { after: 200 }
            }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2200, 2200, 2313, 2313],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Layer", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Duration", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Content", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Access Frequency", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "E8F4F8", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Short-Term Memory", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Current session" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Action sequences, recent observations, current goal state" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Very High" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "FFF8E7", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Long-Term Memory", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Persistent across sessions" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "World state, base locations, known structures, item locations" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Medium" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "E8F8F0", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Knowledge Base", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Permanently stored" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Crafting recipes, lessons learned, strategy patterns" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Low (query-based)" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Short-Term Memory Design")] }),
            new Paragraph({
                children: [new TextRun("Short-term memory is maintained in Python memory and structured as a sliding window of the most recent N interactions. It captures the current goal context and recent action-observation history.")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Structure: ring buffer of action-observation pairs, max window size configurable (default: 20)" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Content: {action, observation, reward, timestamp, goal_id} for each step" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Summarization: when buffer is full, oldest entries are condensed into a summary before eviction" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Access: directly available to LLM context, with automatic pruning of low-relevance entries" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Long-Term Memory Design")] }),
            new Paragraph({
                children: [new TextRun("Long-term memory persists world state information across sessions using SQLite. It is designed for fast retrieval and automatic consolidation of observations into structured knowledge.")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "World state: bot position, inventory snapshots, discovered biomes and structures" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Spatial memory: base locations, resource nodes, exploration routes" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Temporal indexing: observations are tagged with game-time for time-aware queries" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Periodic consolidation: daily batch job merges redundant entries and updates statistics" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.4 Knowledge Base Design")] }),
            new Paragraph({
                children: [new TextRun("The knowledge base stores generalized patterns and lessons that can be applied across different situations. It is the most abstract layer, built through the reflection process.")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Crafting knowledge: all available recipes, ingredient requirements, tool efficiency comparisons" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Strategy patterns: successful approaches for common scenarios (e.g., \"night survival protocol\")" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Failure lessons: categorized failure records with root cause analysis" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Query interface: semantic search over knowledge entries for context-relevant retrieval" })]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第四章：目标规划器架构
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Chapter 4: Goal Planner Architecture")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Technology Tree Architecture")] }),
            new Paragraph({
                children: [new TextRun("The tech tree defines 40+ goals organized in a directed acyclic graph (DAG). Each goal has prerequisites, expected duration, resource requirements, and success criteria. The tree is divided into five phases.")],
                spacing: { after: 200 }
            }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1800, 4526, 2700],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Goals", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Prerequisites", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "FFF3CD", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 1", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Gather wood, craft wooden tools, build shelter, survive first night" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "None (starter)" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "D4EDDA", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 2", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Mine stone, craft stone tools, build farm, establish food supply" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 1 complete" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "CCE5FF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 3", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Mine iron, craft iron tools, build better farm, expand base" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Stone tools + farm" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "E2D9F3", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 4", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Mine diamonds, enchantments, explore nether, build nether hub" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Iron tools + blaze" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "F8D7DA", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 5", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Defeat ender dragon, explore end cities, defeat wither" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Diamonds + end portal" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Goal Queue Management")] }),
            new Paragraph({
                children: [new TextRun("The goal queue manages the active goal stack with dynamic priority adjustment. Goals can be paused, resumed, cancelled, or inserted based on changing conditions.")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Priority scoring: urgency * importance / effort, recalculated on every perception cycle" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Dependency management: sub-goals are automatically queued when parent goal is activated" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Interruption handling: high-priority goals (e.g., survival) can preempt current goal" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Progress tracking: each goal maintains progress percentage and estimated time remaining" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 State Analyzer")] }),
            new Paragraph({
                children: [new TextRun("The state analyzer evaluates current world state against goal requirements to determine feasibility and identify missing resources.")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Resource gap analysis: compares current inventory against goal requirements" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Environment feasibility: checks if the target location/structure exists or can be built" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Risk assessment: evaluates threat level against goal importance for risk-adjusted planning" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Time estimation: predicts game-time and real-time required based on historical performance" })]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第五章：自主决策循环
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Chapter 5: Autonomous Decision Loop Architecture")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 ReAct Loop Architecture")] }),
            new Paragraph({
                children: [new TextRun("The decision loop implements the ReAct (Reasoning + Acting) pattern. Each iteration consists of thought, action, and observation phases, enabling the agent to reason about its actions before executing them.")],
                spacing: { after: 200 }
            }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1500, 3770, 3756],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3770, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Input", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3756, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Output", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: "FFF3CD", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Thought", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 3770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Perception + memory + goal context" })] })] }),
                            new TableCell({ borders, width: { size: 3756, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Reasoning chain (LLM)" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: "CCE5FF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Action", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 3770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Structured action JSON" })] })] }),
                            new TableCell({ borders, width: { size: 3756, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "HTTP POST to JS execution layer" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: "D4EDDA", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Observe", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 3770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Action result + new perception" })] })] }),
                            new TableCell({ borders, width: { size: 3756, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Updated state + memory write" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 Loop Control Flow")] }),

            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Check if current goal is complete or failed" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Collect perception snapshot from JS layer" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Retrieve relevant memories (short-term + filtered long-term)" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Build LLM prompt with thought template" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Call DeepSeek-v3.2 to generate thought and action" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Validate action against allowed action set" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Execute action via HTTP, wait for result" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Evaluate result, update memories, invoke critic if needed" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Loop until goal complete, max iterations, or critical failure" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.3 Safety Mechanisms")] }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Action validation: all LLM-generated actions are validated against a whitelist before execution" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Timeout enforcement: each action has a maximum execution time; stuck actions are terminated" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Death recovery: death events trigger automatic respawn and context recovery" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Iteration limits: max iterations per goal prevents infinite loops" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Fallback strategies: if LLM fails, agent falls back to scripted survival behaviors" })]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第六章：反思与自我修正
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Chapter 6: Reflection and Self-Correction Architecture")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 Reflection System Overview")] }),
            new Paragraph({
                children: [new TextRun("The reflection system enables the agent to learn from experience and improve its future decision-making. It consists of three interconnected components: the critic, failure analyzer, and strategy manager.")],
                spacing: { after: 200 }
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.2 Critic Module")] }),
            new Paragraph({
                children: [new TextRun("The critic evaluates action outcomes against expected results, providing a reward signal and qualitative feedback.")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Success evaluation: did the action achieve its intended sub-goal?" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Efficiency rating: was the action performed optimally or were there wasted steps?" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Side effect tracking: did the action cause unintended changes to the environment?" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Root cause identification: why did success or failure occur?" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.3 Failure Analyzer")] }),
            new Paragraph({
                children: [new TextRun("The failure analyzer classifies failures into categories and determines appropriate responses.")],
                spacing: { after: 200 }
            }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2500, 3500, 3026],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Failure Type", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Example", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Response", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Navigation Failure" })] })] }),
                            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Cannot reach target due to obstacle" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Try alternate path or dig through" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Resource Missing" })] })] }),
                            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Required block not found at location" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Update map, search elsewhere" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Combat Failure" })] })] }),
                            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Died during combat with mob" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Get better gear, avoid or approach differently" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Crafting Failure" })] })] }),
                            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Missing ingredients for recipe" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Queue gathering sub-goal" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.4 Strategy Manager")] }),
            new Paragraph({
                children: [new TextRun("The strategy manager maintains a library of tactical patterns and selects the most appropriate strategy for the current context.")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Strategy patterns: named tactical approaches (e.g., \"aggressive mining\", \"stealth exploration\")" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Effectiveness tracking: each strategy records success/failure history by context type" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Dynamic selection: strategy chosen based on current threat level, resources, and goal type" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Learning: strategies are refined based on accumulated experience data" })]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第七章：实现路线图
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Chapter 7: Implementation Roadmap")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.1 Implementation Phases")] }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1200, 2500, 2500, 2826],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Modules", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "New Files", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Effort", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "DC3545", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 1", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Perception Layer Upgrade" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "environment.js, threat.js, resources.js, progress.js, worldMap.js, aggregator.js" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "1-2 weeks" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "DC3545", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 2", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Memory System" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "shortTerm.js, longTerm.js, knowledge.js, memoryManager.js" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "1-2 weeks" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "FFC107", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 3", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Goal Planner" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "techTree.js, goalQueue.js, stateAnalyzer.js, planner.js" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "2-3 weeks" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "FFC107", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 4", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Decision Loop" })] })] }),
                            new TableCell({ borders: { top: border, bottom: border, left: border, right: border }, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "agentLoop.js, reactor.js, botClient.js, promptManager.js, actionValidator.js" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "2-3 weeks" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "28A745", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Phase 5", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Reflection System" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "critic.js, failureAnalyzer.js, strategyManager.js, reflectionTrigger.js" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "1-2 weeks" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.2 Risk Mitigation")] }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Each phase produces a testable artifact before moving to the next", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Existing functionality is preserved through backward-compatible interfaces", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "LLM costs are controlled through caching, summarization, and fallback strategies", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "Performance bottlenecks are monitored and addressed in each phase", bold: false })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.3 Testing Strategy")] }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Unit tests: each module has isolated tests with mocked dependencies" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Integration tests: JS-Python communication tested with simulated responses" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Simulation tests: agent runs in a controlled Minecraft environment" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "Human evaluation: periodic human review of agent behavior quality" })]
            }),
            new Paragraph({ children: [] }),

            // 附录
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Appendix: API Summary")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("A.1 JavaScript to Python API")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2000, 2000, 5026],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Endpoint", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Method", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 5026, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Purpose", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "/perception" })] })] }),
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "POST" })] })] }),
                            new TableCell({ borders, width: { size: 5026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Send aggregated environment state to AI layer" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "/action" })] })] }),
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "POST" })] })] }),
                            new TableCell({ borders, width: { size: 5026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Execute structured action (with basic collision avoidance)" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "/status" })] })] }),
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "GET" })] })] }),
                            new TableCell({ borders, width: { size: 5026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Query current bot status and action state" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("A.2 Python Internal Modules")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2500, 6526],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Module", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Responsibility", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "server.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Flask HTTP server, route handling, request validation" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "agentLoop.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Main ReAct loop, iteration control, goal management" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "memoryManager.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Unified memory interface, coordinates all three memory layers" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "planner.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Goal decomposition, tech tree navigation, state analysis" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "critic.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Outcome evaluation, failure analysis, strategy adjustment" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "brain.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "LLM interaction, prompt construction, response parsing" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            // 文档信息
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 600 },
                children: [new TextRun({ text: "\u2014\u2014 End of Document \u2014\u2014", size: 20, color: "999999" })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Minecraft AI Agent Architecture Design v2.0", size: 18, italics: true, color: "999999" })]
            })
        ]
    }]
});

// 生成文档
Packer.toBuffer(doc).then(buffer => {
    const outputPath = 'e:/深度学习项目/Minecraft智能体项目/设计文档/Minecraft_AI_Agent_Architecture_Design.docx';
    fs.writeFileSync(outputPath, buffer);
    console.log('Word document generated successfully: ' + outputPath);
}).catch(err => {
    console.error('Error generating document:', err);
    process.exit(1);
});
