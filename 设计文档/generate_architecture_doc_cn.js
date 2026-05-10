const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
        ShadingType, PageNumber, PageBreak, LevelFormat,
        TableOfContents } = require('docx');
const fs = require('fs');

// 创建边框样式
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

// 创建文档
const doc = new Document({
    styles: {
        default: {
            document: {
                run: { font: "微软雅黑", size: 24 }
            }
        },
        paragraphStyles: [
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 40, bold: true, font: "微软雅黑", color: "1F4E79" },
                paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 }
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 32, bold: true, font: "微软雅黑", color: "2E75B6" },
                paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 }
            },
            {
                id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { size: 26, bold: true, font: "微软雅黑", color: "3A7AB8" },
                paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 }
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
                    children: [new TextRun({ text: "Minecraft AI 智能体 —— 架构设计文档", italics: true, size: 20, color: "666666" })]
                })]
            })
        },
        footers: {
            default: new Footer({
                children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "第 ", size: 20 }),
                        new TextRun({ children: [PageNumber.CURRENT], size: 20 }),
                        new TextRun({ text: " 页，共 ", size: 20 }),
                        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 20 }),
                        new TextRun({ text: " 页", size: 20 })
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
                    text: "Minecraft AI 智能体",
                    bold: true, size: 72, font: "微软雅黑", color: "1F4E79"
                })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({
                    text: "自主智能体架构设计",
                    bold: true, size: 48, font: "微软雅黑", color: "2E75B6"
                })]
            }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "v2.0 —— 2026.04", size: 28, color: "666666" })]
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "———— 架构设计文档系列 ————", size: 24, color: "999999" })]
            }),
            new Paragraph({ children: [] }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "涵盖感知层、记忆系统、目标规划、决策循环与反思模块", size: 22, italics: true, color: "888888" })]
            }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [new PageBreak()] }),

            // 目录
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("目录")] }),
            new TableOfContents("目录", { hyperlink: true, headingStyleRange: "1-3" }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第一章：整体架构设计
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("第一章：整体架构设计")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.1 系统概述")] }),
            new Paragraph({
                children: [new TextRun("Minecraft AI 智能体是一个双层智能系统，结合了 JavaScript 执行层和 Python AI 大脑层。执行层（Node.js + Mineflayer）负责实时感知和动作执行，AI 大脑层（Python + Flask + DeepSeek-v3.2）负责高层规划和决策。两层通过 HTTP REST API 通信，实现自然语言指令解析、自主行为规划和闭环反馈优化。")],
                spacing: { after: 200 }
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.2 高层架构图")] }),

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
                            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "JavaScript 执行层（Node.js + Mineflayer）", bold: true, size: 24, color: "FFFFFF" })] })]
                        })]
                    }),
                    new TableRow({
                        children: [new TableCell({
                            borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" }, left: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" }, right: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" } },
                            width: { size: 9026, type: WidthType.DXA },
                            shading: { fill: "EBF3FB", type: ShadingType.CLEAR },
                            margins: { top: 80, bottom: 80, left: 200, right: 200 },
                            children: [
                                new Paragraph({ children: [new TextRun({ text: "感知层（environment / threat / resources / progress / worldMap / aggregator）", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "动作执行（navigate / attack / dig / placeBlock / useItem / equip / itemManage / blockInteract / stop）", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "反馈层（death / movement）", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "状态管理（snapshot）", size: 22 })] })
                            ]
                        })]
                    }),
                    new TableRow({
                        children: [new TableCell({
                            borders: { top: { style: BorderStyle.SINGLE, size: 8, color: "2E75B6" }, bottom: { style: BorderStyle.SINGLE, size: 8, color: "2E75B6" }, left: { style: BorderStyle.SINGLE, size: 4, color: "2E75B6" }, right: { style: BorderStyle.SINGLE, size: 4, color: "2E75B6" } },
                            width: { size: 9026, type: WidthType.DXA },
                            shading: { fill: "2E75B6", type: ShadingType.CLEAR },
                            margins: { top: 80, bottom: 80, left: 200, right: 200 },
                            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "HTTP REST → Python AI 大脑层", bold: true, size: 24, color: "FFFFFF" })] })]
                        })]
                    }),
                    new TableRow({
                        children: [new TableCell({
                            borders: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" }, left: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" }, right: { style: BorderStyle.SINGLE, size: 4, color: "1F4E79" } },
                            width: { size: 9026, type: WidthType.DXA },
                            shading: { fill: "F5F9FD", type: ShadingType.CLEAR },
                            margins: { top: 80, bottom: 80, left: 200, right: 200 },
                            children: [
                                new Paragraph({ children: [new TextRun({ text: "智能体循环（perception / planning / decision / reflection）", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "记忆系统（short-term / long-term / knowledge）", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "目标规划器（tech tree / goal queue / state analyzer）", size: 22 })] }),
                                new Paragraph({ children: [new TextRun({ text: "DeepSeek-v3.2 大语言模型", size: 22 })] })
                            ]
                        })]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.3 模块职责")] }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2500, 6526],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "模块", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "职责描述", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "感知层" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "实时环境扫描、威胁评估、资源检测、进度追踪、世界地图管理" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "记忆系统" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "短期：动作序列和上下文；长期：世界状态持久化；知识库：经验教训" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "目标规划器" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "含40+目标的科技树、目标分解与优先级排序、状态分析" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "智能体循环" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "ReAct 风格决策循环：感知→规划→行动→反思，持续自主行为" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "反思/评价器" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "失败分析、策略调整、从错误中学习、持续自我改进" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.4 数据流程")] }),

            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "用户发送自然语言指令（例如：\"建造一个木屋\"）" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "智能体循环解析指令并生成目标" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "规划器根据科技树将目标分解为子目标" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "感知层提供当前环境状态" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "大语言模型使用 ReAct 推理生成下一步动作" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "执行层运行动作并返回观察结果" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "记忆系统存储经验；评价器评估成功/失败" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "循环直到目标达成或达到最大迭代次数" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("1.5 模块依赖关系")] }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [3000, 3000, 3026],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "上游模块", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "下游模块", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "数据流向", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "感知层" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "智能体循环" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "环境快照 → 规划上下文" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "规划器" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "科技树" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "目标需求 → 依赖检查" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "智能体循环" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "大语言模型" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "上下文 + 记忆 → 动作决策" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "评价器" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "记忆系统" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "评估结果 → 经验存储" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "记忆系统" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "规划器" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "世界状态 → 规划可行性" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第二章：感知层架构
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("第二章：感知层架构")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 感知层架构概述")] }),
            new Paragraph({
                children: [new TextRun("感知层在现有 scan.js 基础上构建，扩展为六个专门子模块。每个模块负责环境理解的一个特定方面，聚合器将它们的输出合成为统一语义状态供 AI 大脑使用。")],
                spacing: { after: 200 }
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 模块架构")] }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2000, 3513, 3513],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "模块", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "输入", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "输出", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "environment.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Bot位置、时间、天气、附近方块" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "生物群系、地形类型、避难分析、危险等级" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "threat.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "附近实体、血量、装备状态" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "威胁列表（类型/距离/严重程度）、逃跑建议" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "resources.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "背包、附近方块、实体掉落物" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "资源清单（分类）、附近资源地图" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "progress.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "背包、建筑、科技树状态" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "完成百分比、可选目标、瓶颈分析" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "worldMap.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "已探索方块、Bot移动轨迹" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "分块地图、探索覆盖率、家位置" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "aggregator.js", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "五个子模块的输出" })] })] }),
                            new TableCell({ borders, width: { size: 3513, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "统一语义状态快照，供 AI 消费" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.3 关键设计决策")] }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "异步感知：每个子模块独立运行，防止一个慢速扫描阻塞整个感知管道", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "自适应扫描半径：感知范围根据当前威胁等级动态调整（安全时扩大，危险时缩小）", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "增量更新：仅发送变化的部分到 AI 层，减少通信开销", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "缓存失效：环境状态被缓存，仅在 Bot 移动或时间显著变化时刷新", bold: false })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.4 聚合器接口")] }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [3000, 3000, 3026],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "字段", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "类型", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "描述", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "position", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "{x, y, z}" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Bot 当前坐标" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "environment", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "EnvironmentState" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "生物群系、地形、避难所、危险" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "threats", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Threat[]" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "按严重程度排序" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "resources", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "ResourceInventory" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "按材料类型组织" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "progress", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "ProgressState" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "百分比、目标、瓶颈" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "worldMap", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 3000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "WorldMap" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "分块、覆盖率、家" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第三章：记忆系统架构
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("第三章：记忆系统架构")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 三层记忆架构")] }),
            new Paragraph({
                children: [new TextRun("记忆系统由三个层次组成，每个层次具有不同的特征和用途。层次结构借鉴了 Atkinson-Shiffrin 记忆模型，并为自主智能体进行了适配。")],
                spacing: { after: 200 }
            }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2200, 2200, 2313, 2313],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "层次", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "持续时间", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "内容", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "访问频率", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "E8F4F8", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "短期记忆", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "当前会话" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "动作序列、最近观察、当前目标状态" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "非常高" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "FFF8E7", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "长期记忆", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "跨会话持久化" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "世界状态、基地位置、已知结构、物品位置" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "中等" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, shading: { fill: "E8F8F0", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "知识库", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 2200, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "永久存储" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "合成配方、经验教训、策略模式" })] })] }),
                            new TableCell({ borders, width: { size: 2313, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "低（按需查询）" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 短期记忆设计")] }),
            new Paragraph({
                children: [new TextRun("短期记忆在 Python 内存中维护，结构为最近 N 个交互的滑动窗口。它捕获当前目标上下文和最近的动作-观察历史。")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "结构：动作-观察对环形缓冲区，最大窗口大小可配置（默认：20）" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "内容：每个步骤 {action, observation, reward, timestamp, goal_id}" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "摘要：当缓冲区满时，最旧条目在清除前被压缩成摘要" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "访问：直接供 LLM 上下文使用，自动剪枝低相关度条目" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 长期记忆设计")] }),
            new Paragraph({
                children: [new TextRun("长期记忆使用 SQLite 在会话间持久化世界状态信息。它专为快速检索和自动整合观察为结构化知识而设计。")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "世界状态：Bot 位置、背包快照、发现的生物群系和结构" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "空间记忆：基地位置、资源节点、探索路线" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "时间索引：观察用游戏时间标记，用于时间感知查询" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "定期整合：每日批处理合并冗余条目并更新统计" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.4 知识库设计")] }),
            new Paragraph({
                children: [new TextRun("知识库存储可应用于不同情境的通用模式和经验教训。它是最抽象的层次，通过反思过程构建。")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "合成知识：所有可用配方、原料需求、工具效率比较" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "策略模式：常见场景的成功方法（例如：\"夜间生存协议\"）" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "失败教训：带有根因分析的分类失败记录" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "查询接口：知识条目的语义搜索，用于上下文相关检索" })]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第四章：目标规划器架构
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("第四章：目标规划器架构")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 科技树架构")] }),
            new Paragraph({
                children: [new TextRun("科技树定义了 40+ 个目标，组织为有向无环图（DAG）。每个目标都有前置条件、预期时长、资源需求和成功标准。科技树分为五个阶段。")],
                spacing: { after: 200 }
            }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1800, 4526, 2700],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "阶段", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "目标", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "前置条件", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "FFF3CD", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "第一阶段", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "采集木头、制作木工具、建造避难所、度过第一个夜晚" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "无（起始）" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "D4EDDA", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "第二阶段", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "挖石头、制作石工具、建造农场、建立食物供应" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "第一阶段完成" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "CCE5FF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "第三阶段", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "挖铁、制作铁工具、建造更好的农场、扩展基地" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "石工具 + 农场" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "E2D9F3", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "第四阶段", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "挖钻石、附魔、探索下界、建造下界交通枢纽" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "铁工具 + 烈焰人" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1800, type: WidthType.DXA }, shading: { fill: "F8D7DA", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "第五阶段", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 4526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "击败末影龙、探索末地城、击败凋灵" })] })] }),
                            new TableCell({ borders, width: { size: 2700, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "钻石 + 末地传送门" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 目标队列管理")] }),
            new Paragraph({
                children: [new TextRun("目标队列管理活动目标栈，具有动态优先级调整。目标可以根据变化的条件被暂停、恢复、取消或插入。")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "优先级评分：紧迫性 × 重要性 / 努力值，每个感知周期重新计算" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "依赖管理：当父目标被激活时，子目标自动入队" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "中断处理：高优先级目标（例如：生存）可以抢占当前目标" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "进度追踪：每个目标维护完成百分比和预计剩余时间" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 状态分析器")] }),
            new Paragraph({
                children: [new TextRun("状态分析器评估当前世界状态与目标需求的对比，以确定可行性并识别缺失资源。")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "资源差距分析：比较当前背包与目标需求" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "环境可行性：检查目标位置/结构是否存在或可以建造" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "风险评估：评估威胁等级与目标重要性，进行风险调整规划" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "时间估算：基于历史性能预测所需游戏时间和现实时间" })]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第五章：自主决策循环
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("第五章：自主决策循环架构")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.1 ReAct 循环架构")] }),
            new Paragraph({
                children: [new TextRun("决策循环实现 ReAct（推理 + 行动）模式。每次迭代由思考、行动和观察阶段组成，使智能体能够在执行动作之前进行推理。")],
                spacing: { after: 200 }
            }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1500, 3770, 3756],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "阶段", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3770, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "输入", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3756, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "输出", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: "FFF3CD", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "思考", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 3770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "感知 + 记忆 + 目标上下文" })] })] }),
                            new TableCell({ borders, width: { size: 3756, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "推理链（LLM）" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: "CCE5FF", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "行动", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 3770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "结构化动作 JSON" })] })] }),
                            new TableCell({ borders, width: { size: 3756, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "HTTP POST 到 JS 执行层" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1500, type: WidthType.DXA }, shading: { fill: "D4EDDA", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "观察", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 3770, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "动作结果 + 新感知" })] })] }),
                            new TableCell({ borders, width: { size: 3756, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "更新状态 + 记忆写入" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.2 循环控制流")] }),

            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "检查当前目标是否完成或失败" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "从 JS 层收集感知快照" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "检索相关记忆（短期 + 筛选后的长期）" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "使用思考模板构建 LLM 提示词" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "调用 DeepSeek-v3.2 生成思考和动作" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "验证动作是否在允许的动作集合中" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "通过 HTTP 执行动作，等待结果" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "评估结果、更新记忆、必要时调用评价器" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "循环直到目标完成、最大迭代或关键失败" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("5.3 安全机制")] }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "动作验证：所有 LLM 生成的动作在执行前都经过白名单验证" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "超时执行：每个动作都有最大执行时间；卡住的动作会被终止" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "死亡恢复：死亡事件触发自动复活和上下文恢复" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "迭代限制：每个目标的最大迭代次数防止无限循环" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "回退策略：如果 LLM 失败，智能体回退到脚本化生存行为" })]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第六章：反思与自我修正
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("第六章：反思与自我修正架构")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.1 反思系统概述")] }),
            new Paragraph({
                children: [new TextRun("反思系统使智能体能够从经验中学习并改进未来的决策。它由三个相互关联的组件组成：评价器、失败分析器和策略管理器。")],
                spacing: { after: 200 }
            }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.2 评价器模块")] }),
            new Paragraph({
                children: [new TextRun("评价器根据预期结果评估动作结果，提供奖励信号和定性反馈。")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "成功评估：动作是否达到了其预期的子目标？" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "效率评级：动作是否以最优方式执行，是否有浪费的步骤？" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "副作用追踪：动作是否导致环境的意外变化？" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "根因识别：成功或失败的原因是什么？" })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.3 失败分析器")] }),
            new Paragraph({
                children: [new TextRun("失败分析器将失败分类并确定适当的响应。")],
                spacing: { after: 200 }
            }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2500, 3500, 3026],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "失败类型", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "示例", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "响应", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "导航失败" })] })] }),
                            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "由于障碍无法到达目标" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "尝试替代路径或挖穿" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "资源缺失" })] })] }),
                            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "目标位置未找到所需方块" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "更新地图、去别处搜索" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "战斗失败" })] })] }),
                            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "与生物战斗时死亡" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "获取更好的装备、改变策略" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "合成失败" })] })] }),
                            new TableCell({ borders, width: { size: 3500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "配方缺少材料" })] })] }),
                            new TableCell({ borders, width: { size: 3026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "将采集子目标入队" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("6.4 策略管理器")] }),
            new Paragraph({
                children: [new TextRun("策略管理器维护战术模式库，并根据当前上下文选择最合适的策略。")],
                spacing: { after: 200 }
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "策略模式：命名战术方法（例如：\"激进采矿\"、\"潜行探索\"）" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "效果追踪：每种策略按上下文类型记录成功/失败历史" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "动态选择：根据当前威胁等级、资源和目标类型选择策略" })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "学习：策略基于累积的经验数据进行改进" })]
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // 第七章：实现路线图
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("第七章：实现路线图")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.1 实施阶段")] }),

            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [1200, 2500, 2500, 2826],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "阶段", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "模块", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "新增文件", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "工作量", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "DC3545", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "阶段1", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "感知层升级" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "environment.js, threat.js, resources.js, progress.js, worldMap.js, aggregator.js" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "1-2 周" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "DC3545", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "阶段2", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "记忆系统" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "shortTerm.js, longTerm.js, knowledge.js, memoryManager.js" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "1-2 周" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "FFC107", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "阶段3", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "目标规划器" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "techTree.js, goalQueue.js, stateAnalyzer.js, planner.js" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "2-3 周" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "FFC107", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "阶段4", bold: true })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "决策循环" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "agentLoop.js, reactor.js, botClient.js, promptManager.js, actionValidator.js" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "2-3 周" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 1200, type: WidthType.DXA }, shading: { fill: "28A745", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "阶段5", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "反思系统" })] })] }),
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "critic.js, failureAnalyzer.js, strategyManager.js, reflectionTrigger.js" })] })] }),
                            new TableCell({ borders, width: { size: 2826, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "1-2 周" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.2 风险缓解")] }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "每个阶段在进入下一阶段前产生可测试的产物", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "通过向后兼容接口保留现有功能", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "通过缓存、摘要和回退策略控制 LLM 成本", bold: false })]
            }),
            new Paragraph({
                numbering: { reference: "bullets", level: 0 },
                children: [new TextRun({ text: "监控每个阶段的性能瓶颈并加以解决", bold: false })]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("7.3 测试策略")] }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "单元测试：每个模块使用模拟依赖进行隔离测试" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "集成测试：使用模拟响应测试 JS-Python 通信" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "模拟测试：智能体在受控 Minecraft 环境中运行" })]
            }),
            new Paragraph({
                numbering: { reference: "numbers", level: 0 },
                children: [new TextRun({ text: "人工评估：定期人工审查智能体行为质量" })]
            }),
            new Paragraph({ children: [] }),

            // 附录
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("附录：API 汇总")] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("A.1 JavaScript 到 Python API")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2000, 2000, 5026],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "端点", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "方法", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 5026, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "用途", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "/perception" })] })] }),
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "POST" })] })] }),
                            new TableCell({ borders, width: { size: 5026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "发送聚合环境状态到 AI 层" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "/action" })] })] }),
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "POST" })] })] }),
                            new TableCell({ borders, width: { size: 5026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "执行结构化动作（含简单碰撞检测）" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "/status" })] })] }),
                            new TableCell({ borders, width: { size: 2000, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "GET" })] })] }),
                            new TableCell({ borders, width: { size: 5026, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "查询当前 Bot 状态和动作状态" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("A.2 Python 内部模块")] }),
            new Table({
                width: { size: 9026, type: WidthType.DXA },
                columnWidths: [2500, 6526],
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "模块", bold: true, color: "FFFFFF" })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, shading: { fill: "2E75B6", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "职责", bold: true, color: "FFFFFF" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "server.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "Flask HTTP 服务器、路由处理、请求验证" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "agentLoop.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "主 ReAct 循环、迭代控制、目标管理" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "memoryManager.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "统一记忆接口，协调三个记忆层次" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "planner.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "目标分解、科技树导航、状态分析" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "critic.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "结果评估、失败分析、策略调整" })] })] })
                        ]
                    }),
                    new TableRow({
                        children: [
                            new TableCell({ borders, width: { size: 2500, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "brain.py", italics: true })] })] }),
                            new TableCell({ borders, width: { size: 6526, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [new Paragraph({ children: [new TextRun({ text: "LLM 交互、提示词构建、响应解析" })] })] })
                        ]
                    })
                ]
            }),
            new Paragraph({ children: [] }),

            // 文档信息
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 600 },
                children: [new TextRun({ text: "———— 文档结束 ————", size: 20, color: "999999" })]
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "Minecraft AI 智能体架构设计 v2.0", size: 18, italics: true, color: "999999" })]
            })
        ]
    }]
});

// 生成文档
Packer.toBuffer(doc).then(buffer => {
    const outputPath = 'e:/深度学习项目/Minecraft智能体项目/设计文档/Minecraft_AI_Agent_Architecture_Design_CN.docx';
    fs.writeFileSync(outputPath, buffer);
    console.log('Word 文档生成成功：' + outputPath);
}).catch(err => {
    console.error('生成文档时出错：', err);
    process.exit(1);
});
