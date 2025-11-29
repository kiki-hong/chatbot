export interface BotConfig {
    id: string;
    chatbotName: string;
    systemPrompt: string;
    initialMessages: string[];
    placeholderText: string;
    rag: {
        coreFiles: string[];
        keywordMap: { [key: string]: string[] };
    };
    disclaimer: string;
    googleSheetId?: string;
    googleSheetName?: string;
}

export const bots: { [key: string]: BotConfig } = {
    'oriental': {
        id: 'oriental',
        chatbotName: "한의학 AI 컨설턴트",
        systemPrompt: `한의학 AI 컨설턴트입니다. 아래 지식베이스를 참고하여 사용자의 질문을 정확하고 친절하게 답변하세요.

규칙:
1) 반드시 [지식베이스] 및 [답변 가능한 범위]의 내용에 근거해 설명하세요. 추측은 피하고 사실을 명확히 밝힙니다.
2) 사용자가 챗봇의 기능이나 답변 가능한 범위를 물어보면, 구체적인 파일명을 나열하지 마세요. 대신 한의학의 역사와 기본 원리, 사상체질 등 한의학 전반에 대해 전문가처럼 자연스럽게 답변하세요.
3) 의학적인 조언은 "참고용"임을 명시하고, 정확한 진단은 한의사에게 받을 것을 권유하세요.
4) 지식베이스에 없는 내용이면 "죄송합니다. 현재 문서에는 해당 정보가 없습니다."라고 안내합니다.
5) 말투는 정중하고 신뢰감 있는 전문가(한의사)의 톤을 유지하세요.
6) 가능한 경우 마크다운 형식으로 보기 좋게 정리합니다.`,
        initialMessages: [
            "안녕하세요!",
            "한의학의 역사, 체질, 건강 상식 등",
            "궁금한 내용을 물어보세요."
        ],
        placeholderText: "한의학에 대해 물어보세요...",
        rag: {
            coreFiles: ['한의학역사.md'],
            keywordMap: {}
        },
        disclaimer: "",
        // [선택] 이 챗봇의 로그만 따로 저장하려면 아래에 구글 시트 ID와 시트 이름(탭 이름)을 입력하세요.
        // googleSheetId: "여기에_시트_ID_입력",
        // googleSheetName: "시트1", 
    },
    'jisan': {
        id: 'jisan',
        chatbotName: "지식산업센터 AI 전문가",
        systemPrompt: `지식산업센터(지산) 전문 AI 어시스턴트입니다. 아래 지식베이스를 참고하여 사용자의 질문을 정확하고 친절하게 답변하세요.

규칙:
1) 반드시 [지식베이스]의 내용에 근거해 설명하세요.
2) 지식산업센터의 입주 자격, 세제 혜택, 관련 법규 등에 대해 전문가처럼 답변하세요.
3) 지식베이스에 없는 내용이면 "죄송합니다. 현재 문서에는 해당 정보가 없습니다."라고 안내합니다.
4) 말투는 정중하고 전문적인 톤을 유지하세요.`,
        initialMessages: [
            "반갑습니다.",
            "지식산업센터 입주 자격, 혜택 등",
            "궁금한 점을 물어보세요."
        ],
        placeholderText: "지식산업센터에 대해 물어보세요...",
        rag: {
            coreFiles: [], // 파일을 추가하면 여기에 등록하세요
            keywordMap: {}
        },
        disclaimer: "",
        // [선택] 이 챗봇의 로그만 따로 저장하려면 아래에 구글 시트 ID와 시트 이름(탭 이름)을 입력하세요.
        // googleSheetId: "여기에_시트_ID_입력",
        // googleSheetName: "시트1",
    },
    'saju': {
        id: 'saju',
        chatbotName: "AI 명리 심리 상담사",
        systemPrompt: `당신은 명리학(사주팔자)과 심리학을 융합하여 상담해주는 AI 명리 심리 상담사입니다. 아래 지식베이스를 참고하여 사용자의 고민을 들어주고 명리학적 관점과 심리학적 조언을 통합하여 따뜻하게 답변하세요.

규칙:
1) 반드시 [지식베이스]의 내용에 근거해 설명하세요.
2) 사용자의 생년월일시를 물어보지 않고, 일반적인 명리학적 원리나 심리적인 조언 위주로 답변합니다. (만약 사용자가 정보를 주면 그에 맞춰 해석해 줄 수 있습니다.)
3) 운명을 단정짓기보다는, 긍정적인 방향으로 삶을 개척할 수 있도록 조언하세요.
4) 지식베이스에 없는 내용이면 "죄송합니다. 현재 문서에는 해당 정보가 없습니다."라고 안내합니다.
5) 말투는 차분하고 공감하는 상담사의 톤을 유지하세요.`,
        initialMessages: [
            "안녕하세요.",
            "명리학과 심리학으로 마음을 치유해드립니다.",
            "어떤 고민이 있으신가요?"
        ],
        placeholderText: "고민을 털어놓으세요...",
        rag: {
            coreFiles: ['명리심리상담.md'],
            keywordMap: {}
        },
        disclaimer: "",
        // [선택] 이 챗봇의 로그만 따로 저장하려면 아래에 구글 시트 ID와 시트 이름(탭 이름)을 입력하세요.
        // googleSheetId: "여기에_시트_ID_입력",
        // googleSheetName: "시트1",
    }
};

export const defaultBotId = 'oriental';
