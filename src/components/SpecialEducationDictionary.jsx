import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Lightbulb, Star, History, ArrowRight, Plus, X, FileText, Trash2, MessageSquare, Send, Edit, List, Moon, Sun } from 'lucide-react';

// Force build hash change for deployment v1.0.1
const SpecialEducationDictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTerm, setEditingTerm] = useState(null);
  const [customTerms, setCustomTerms] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [newTerm, setNewTerm] = useState({
    livingWord: '',
    professionalTerm: '',
    category: '',
    definition: '',
    examples: ['']
  });
  const [newSuggestion, setNewSuggestion] = useState({
    type: 'improvement', // 'improvement', 'bug', 'feature'
    title: '',
    description: ''
  });

  // 테마 상태 관리
  const [theme, setTheme] = useState(() => {
    // 로컬 스토리지에서 저장된 테마 불러오기, 없으면 시스템 설정 감지
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // 시스템 다크모드 설정 감지
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // 생활어 → 전공어 변환 데이터베이스 (법률 예문 추가)
  const dictionary = [
    // 기본 장애 유형
    { 
      id: 1, 
      livingWord: "말 더듬기", 
      professionalTerm: "유창성 장애(Fluency Disorder)", 
      category: "언어장애", 
      definition: "말의 리듬이나 속도가 불규칙하여 의사소통에 어려움을 겪는 언어장애", 
      examples: ["말더듬", "말막힘", "말반복"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법 시행령」 제10조: '언어장애란 조음장애, 유창성장애, 음성장애, 기타 언어장애로 인하여...'",
        "「장애인복지법 시행규칙」: '언어장애 중 유창성장애는 말더듬 등으로 인한 언어장애를 의미한다.'"
      ]
    },
    { 
      id: 2, 
      livingWord: "산만한", 
      professionalTerm: "주의력결핍과잉행동장애(ADHD)", 
      category: "정서행동장애", 
      definition: "주의집중의 어려움, 과잉행동, 충동성을 주요 특성으로 하는 신경발달장애", 
      examples: ["집중 못하는", "가만히 못있는", "충동적인"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법」 제15조: '정서·행동장애를 지닌 특수교육대상자에게는 심리·행동적 중재를 제공하여야 한다.'",
        "교육부 「ADHD 학생 교육지원 가이드라인」: 'ADHD 학생은 주의력 결핍과 과잉행동·충동성으로 인해 학습 및 학교생활에 어려움을 겪는다.'"
      ]
    },
    { 
      id: 3, 
      livingWord: "느린 아이", 
      professionalTerm: "지적장애(Intellectual Disability)", 
      category: "지적장애", 
      definition: "인지기능과 적응행동에서 유의미한 제한을 보이는 발달장애", 
      examples: ["학습이 어려운", "이해가 느린", "발달이 늦은"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법 시행령」 제10조: '지적장애를 지닌 특수교육대상자는 지적 기능과 적응행동상의 어려움이 함께 존재한다.'",
        "「장애인복지법」 제32조: '지적장애인이라 함은 정신발육이 항구적으로 지체되어 지적 능력의 발달이 불충분하거나 불완전한 자를 말한다.'"
      ]
    },
    { 
      id: 4, 
      livingWord: "자폐적인", 
      professionalTerm: "자폐스펙트럼장애(ASD)", 
      category: "발달장애", 
      definition: "사회적 의사소통과 상호작용의 지속적 결함, 제한적이고 반복적인 행동패턴을 특징으로 하는 신경발달장애", 
      examples: ["사회성이 부족한", "반복행동하는", "소통이 어려운"],
      legalExamples: [
        "「발달장애인 권리보장 및 지원에 관한 법률」 제2조: '자폐성장애인이란 소아청소년 자폐 등 자폐성장애로 인하여 일상생활이나 사회생활에 상당한 제약을 받는 자를 말한다.'",
        "「장애인 등에 대한 특수교육법 시행령」: '자폐성장애를 지닌 특수교육대상자는 사회적 상호작용과 의사소통에 결함이 있다.'"
      ]
    },
    { 
      id: 5, 
      livingWord: "글을 못 읽는", 
      professionalTerm: "난독증(Dyslexia)", 
      category: "학습장애", 
      definition: "정상적인 지능과 교육기회에도 불구하고 읽기에 어려움을 보이는 특정학습장애", 
      examples: ["읽기 곤란", "문자 인식 어려움", "독해 장애"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법 시행령」 제10조: '학습장애를 지닌 특수교육대상자는 개별 또는 소집단 지도를 통한 반복학습, 학습전략훈련 등을 제공받는다.'",
        "교육부 「학습장애 학생 교육지원 방안」: '읽기장애(난독증)는 글자나 단어를 정확하고 유창하게 읽지 못하는 학습장애의 한 유형이다.'"
      ]
    },

    // 특수교육법 관련
    { 
      id: 11, 
      livingWord: "특수교육 법률", 
      professionalTerm: "특수교육법", 
      category: "법제도", 
      definition: "장애인 등에 대한 특수교육법. 특수교육대상자의 교육적 권리 보장과 교육의 질적 수준 제고를 위한 법률", 
      examples: ["특교법", "장애인 교육법", "특수교육 관련법"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법」 제1조(목적): '이 법은 교육기본법 제18조에 따라 국가 및 지방자치단체가 장애인 및 특별한 교육적 요구가 있는 사람에게 통합된 교육환경을 제공하고...'",
        "「장애인 등에 대한 특수교육법」 제3조(의무교육 등): '특수교육대상자에게는 유치원·초등학교·중학교 및 고등학교 과정의 교육은 의무교육으로 하고, 만 3세부터 만 17세까지 무상으로 교육을 실시한다.'"
      ]
    },
    { 
      id: 12, 
      livingWord: "특수교육 심의기구", 
      professionalTerm: "특수교육운영위원회", 
      category: "법제도", 
      definition: "특수교육대상자의 선정·배치 및 개별화교육계획 등을 심의하는 위원회", 
      examples: ["특교위", "선정배치위원회", "특수교육위원회"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법」 제12조(특수교육운영위원회의 설치): '교육장은 특수교육대상자의 선정·배치, 개별화교육계획의 수립·시행 등에 관한 사항을 심의하기 위하여...'",
        "「특수교육법 시행령」 제16조: '위원회는 특수교육대상자 선정을 위한 진단·평가의 결과를 토대로 대상자 해당 여부를 결정한다.'"
      ]
    },
    { 
      id: 15, 
      livingWord: "특수교육 지원 기관", 
      professionalTerm: "특수교육지원센터", 
      category: "법제도", 
      definition: "특수교육대상자의 조기발견, 특수교육, 진로·직업교육, 가족지원 등을 제공하는 기관", 
      examples: ["특교센터", "특수교육 거점센터", "통합교육지원센터"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법」 제11조: '교육감은 특수교육대상자의 조기발견, 특수교육 관련서비스 지원 등을 담당하는 특수교육지원센터를 설치·운영하여야 한다.'",
        "「특수교육법 시행령」 제13조: '센터는 특수교육대상자 선정을 위한 진단·평가, 정보관리, 교육과정 운영지원, 교원연수, 가족지원, 특수교육 관련서비스, 진로 및 직업교육 지원 등의 업무를 수행한다.'"
      ]
    },
    { 
      id: 16, 
      livingWord: "찾아가는 교육", 
      professionalTerm: "순회교육(150일)", 
      category: "법제도", 
      definition: "특수교육교사가 가정이나 의료기관, 복지시설 등을 방문하여 제공하는 교육서비스. 연간 150일 이상 실시", 
      examples: ["방문교육", "가정방문 수업", "출장 교육"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법 시행령」 제16조의2: '병원이나 집에서 3개월 이상의 교육을 받는 건강장애학생에게 순회교육을 실시하며, 교육과정 운영은 학교교육과정에 준한다.'",
        "「특수교육법 시행규칙」 제4조: '순회교육 및 파견교육은 연간 150일 이상 실시하되, 교육대상 학생의 장애정도 및 특성을 고려하여 조정할 수 있다.'"
      ]
    },

    // 교육과정 관련
    { 
      id: 23, 
      livingWord: "특수교육 교육과정", 
      professionalTerm: "기본 교육과정", 
      category: "교육과정", 
      definition: "특수교육대상자의 장애 특성과 정도를 고려한 특별한 교육과정", 
      examples: ["특수교육과정", "기본과정", "적응형 교육과정"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법」 제20조(교육과정의 운영 등): '특수교육대상자에게는 장애유형·장애정도에 적합한 교육과정 및 특수교육 관련서비스 제공계획을 수립하여 시행하여야 한다.'",
        "교육부 「2022 개정 특수교육 교육과정」: '기본 교육과정은 지적장애, 자폐성장애, 중도·중복장애 학생을 위한 교육과정으로서 학생의 일상생활 적응 능력 향상에 중점을 둔다.'"
      ]
    },

    // 평가도구 관련
    { 
      id: 26, 
      livingWord: "지원 요구도 검사", 
      professionalTerm: "SIS (Supports Intensity Scale)", 
      category: "평가도구", 
      definition: "지적장애인의 지원 요구도를 측정하는 표준화된 평가도구", 
      examples: ["지원강도척도", "SIS-A", "SIS-C"],
      legalExamples: [
        "「발달장애인 권리보장 및 지원에 관한 법률 시행령」 제9조: '개인별지원계획을 수립할 때에는 발달장애인의 특성 및 요구도를 종합적으로 평가하여야 한다.'",
        "보건복지부 「발달장애인 개인별 지원계획 매뉴얼」: 'SIS는 발달장애인이 지역사회에서 성공적으로 생활하기 위해 필요한 지원의 유형과 강도를 파악하는 도구이다.'"
      ]
    },

    // 교수방법 관련  
    { 
      id: 33, 
      livingWord: "이야기로 가르치기", 
      professionalTerm: "사회적 이야기", 
      category: "교수방법", 
      definition: "자폐스펙트럼 장애 학생을 위한 사회적 상황 설명 기법", 
      examples: ["소셜 스토리", "상황 설명", "사회 규칙 학습"],
      legalExamples: [
        "교육부 「자폐성장애 학생 교육지원 가이드라인」: '사회적 이야기(Social Story)는 자폐성장애 학생이 사회적 상황을 이해하고 적절한 행동을 학습할 수 있도록 돕는 교수방법이다.'",
        "「장애인 등에 대한 특수교육법 시행령」 제22조: '자폐성장애를 지닌 특수교육대상자에게는 행동 중재 지원, 보완·대체 의사소통 훈련 등을 제공한다.'"
      ]
    },

    // 의사소통 관련
    { 
      id: 36, 
      livingWord: "보완 의사소통", 
      professionalTerm: "AAC", 
      category: "교수방법", 
      definition: "말로 의사소통하기 어려운 사람을 위한 보완·대안 의사소통 방법", 
      examples: ["보완대체의사소통", "의사소통 보조기기", "커뮤니케이션 도구"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법 시행령」 제22조: '의사소통장애를 지닌 특수교육대상자에게는 보완·대체 의사소통 훈련, 청능훈련, 구어훈련 등을 제공한다.'",
        "「장애인·노인 등을 위한 보조기구 지원 및 활용촉진에 관한 법률」: '의사소통장애인을 위한 보완·대체 의사소통기기의 연구개발 및 보급을 촉진한다.'"
      ]
    },

    // 전환교육 관련
    { 
      id: 42, 
      livingWord: "성인 준비 교육", 
      professionalTerm: "전환교육", 
      category: "교육과정", 
      definition: "학교에서 성인기로의 성공적 이행을 위한 교육", 
      examples: ["transition education", "성인기 준비", "사회 적응 교육"],
      legalExamples: [
        "「장애인 등에 대한 특수교육법」 제23조(전환교육): '중학교 과정 이상의 각급학교의 장은 특수교육대상자가 학교에서 사회 또는 상급학교로 원활하게 이동할 수 있도록 진로 및 직업교육을 포함한 전환교육을 실시하여야 한다.'",
        "「특수교육법 시행령」 제24조: '전환교육은 개별화전환교육계획에 따라 실시하며, 관련 기관과의 연계·협력을 통해 이루어져야 한다.'"
      ]
    }
  ];

  // 로컬 스토리지에서 사용자 정의 용어 불러오기
  useEffect(() => {
    const savedCustomTerms = localStorage.getItem('customTerms');
    if (savedCustomTerms) {
      setCustomTerms(JSON.parse(savedCustomTerms));
    }

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    const savedSuggestions = localStorage.getItem('suggestions');
    if (savedSuggestions) {
      setSuggestions(JSON.parse(savedSuggestions));
    }
  }, []);

  // 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('customTerms', JSON.stringify(customTerms));
  }, [customTerms]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  useEffect(() => {
    localStorage.setItem('suggestions', JSON.stringify(suggestions));
  }, [suggestions]);

  // 테마 초기화 및 적용 - 개선된 버전
  useEffect(() => {
    console.log('테마 변경:', theme); // 디버깅용

    const applyTheme = (themeValue) => {
      console.log('테마 적용 중:', themeValue); // 디버깅용

      if (themeValue === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-theme');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-theme');
      }

      // 강제로 스타일 재계산
      document.documentElement.style.setProperty('--current-theme', themeValue);
      localStorage.setItem('theme', themeValue);
    };

    // 초기 테마 적용
    applyTheme(theme);

    // 시스템 테마 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) { // 저장된 테마가 없을 때만 시스템 테마 따름
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [theme]);

  // 테마 토글 함수 - 디버깅 강화
  const toggleTheme = () => {
    console.log('토글 버튼 클릭! 현재 테마:', theme); // 디버깅용
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('새로운 테마:', newTheme); // 디버깅용
    setTheme(newTheme);
  };

  // 전체 사전 (기본 + 사용자 정의)
  const allTerms = [...dictionary, ...customTerms];

  // 검색 함수
  const handleSearch = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const results = allTerms.filter(item =>
      item.livingWord.includes(term) ||
      item.professionalTerm.includes(term) ||
      item.examples.some(example => example.includes(term)) ||
      item.definition.includes(term)
    );

    setSearchResults(results);
  };

  // 검색어 히스토리 추가 (엔터키 입력시에만)
  const addToSearchHistory = (term) => {
    if (term && term.trim() && !searchHistory.includes(term.trim())) {
      setSearchHistory(prev => [term.trim(), ...prev.slice(0, 4)]);
    }
  };

  // 키보드 이벤트 핸들러
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      addToSearchHistory(searchTerm);
    }
  };

  const toggleFavorite = (item) => {
    setFavorites(prev => {
      const isFavorited = prev.some(fav => fav.id === item.id);
      if (isFavorited) {
        return prev.filter(fav => fav.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  // 사용자 정의 용어 추가
  const handleAddCustomTerm = () => {
    if (!newTerm.livingWord.trim() || !newTerm.professionalTerm.trim()) {
      alert('생활어와 전공어를 모두 입력해주세요.');
      return;
    }

    const customTerm = {
      ...newTerm,
      id: Date.now(),
      examples: newTerm.examples.filter(example => example.trim() !== ''),
      isCustom: true
    };

    setCustomTerms(prev => [...prev, customTerm]);
    setNewTerm({
      livingWord: '',
      professionalTerm: '',
      category: '',
      definition: '',
      examples: ['']
    });
    setShowAddModal(false);
    alert('새로운 용어가 추가되었습니다!');
  };

  // 사용자 정의 용어 편집 시작
  const handleEditCustomTerm = (term) => {
    setEditingTerm({ ...term });
    setNewTerm({
      livingWord: term.livingWord,
      professionalTerm: term.professionalTerm,
      category: term.category,
      definition: term.definition,
      examples: term.examples.length > 0 ? [...term.examples] : ['']
    });
    setShowEditModal(true);
  };

  // 사용자 정의 용어 업데이트
  const handleUpdateCustomTerm = () => {
    if (!newTerm.livingWord.trim() || !newTerm.professionalTerm.trim()) {
      alert('생활어와 전공어를 모두 입력해주세요.');
      return;
    }

    const updatedTerm = {
      ...editingTerm,
      livingWord: newTerm.livingWord,
      professionalTerm: newTerm.professionalTerm,
      category: newTerm.category,
      definition: newTerm.definition,
      examples: newTerm.examples.filter(example => example.trim() !== '')
    };

    setCustomTerms(prev => prev.map(term =>
      term.id === editingTerm.id ? updatedTerm : term
    ));

    // 즐겨찾기에서도 업데이트
    setFavorites(prev => prev.map(fav =>
      fav.id === editingTerm.id ? updatedTerm : fav
    ));

    setNewTerm({
      livingWord: '',
      professionalTerm: '',
      category: '',
      definition: '',
      examples: ['']
    });
    setEditingTerm(null);
    setShowEditModal(false);
    alert('용어가 성공적으로 수정되었습니다!');
  };

  // 사용자 정의 용어 삭제
  const handleDeleteCustomTerm = (id) => {
    if (window.confirm('이 용어를 삭제하시겠습니까?')) {
      setCustomTerms(prev => prev.filter(term => term.id !== id));
      setFavorites(prev => prev.filter(fav => fav.id !== id));
    }
  };

  // 개선사항 제안 추가
  const handleAddSuggestion = () => {
    if (!newSuggestion.title.trim() || !newSuggestion.description.trim()) {
      alert('제목과 설명을 모두 입력해주세요.');
      return;
    }

    const suggestion = {
      ...newSuggestion,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'submitted'
    };

    setSuggestions(prev => [...prev, suggestion]);
    setNewSuggestion({
      type: 'improvement',
      title: '',
      description: ''
    });
    setShowSuggestionModal(false);
    alert('소중한 의견 감사합니다! 검토 후 반영하도록 하겠습니다.');
  };

  // 검색 기록에서 특정 항목 삭제
  const removeFromHistory = (termToRemove) => {
    setSearchHistory(prev => prev.filter(term => term !== termToRemove));
  };

  // 검색 기록 전체 삭제
  const clearSearchHistory = () => {
    if (window.confirm('모든 검색 기록을 삭제하시겠습니까?')) {
      setSearchHistory([]);
    }
  };

  // 검색 기록 클릭시 자동 검색
  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    setActiveTab('search');
  };

  // 예시 입력 필드 추가/제거
  const addExampleField = () => {
    setNewTerm(prev => ({
      ...prev,
      examples: [...prev.examples, '']
    }));
  };

  const removeExampleField = (index) => {
    setNewTerm(prev => ({
      ...prev,
      examples: prev.examples.filter((_, i) => i !== index)
    }));
  };

  const updateExample = (index, value) => {
    setNewTerm(prev => ({
      ...prev,
      examples: prev.examples.map((example, i) => i === index ? value : example)
    }));
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, customTerms]); // eslint-disable-line react-hooks/exhaustive-deps

  const DictionaryCard = ({ item, showFavorite = true }) => (
    <div className="card p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-primary-700 font-semibold text-lg">{item.livingWord}</span>
            <ArrowRight className="w-5 h-5 text-neutral-400" />
            <span className="text-success-600 font-bold text-lg">{item.professionalTerm}</span>
            {item.isCustom && (
              <span className="badge badge-custom">
                사용자 추가
              </span>
            )}
          </div>
          <span className="badge badge-category">
            {item.category}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {showFavorite && (
            <button
              onClick={() => toggleFavorite(item)}
              className={`p-2 rounded-full transition-all ${
                favorites.some(fav => fav.id === item.id)
                  ? 'text-warning-500 hover:text-warning-600 bg-warning-50'
                  : 'text-neutral-400 hover:text-warning-500 hover:bg-warning-50'
              }`}
            >
              <Star className={`w-5 h-5 ${favorites.some(fav => fav.id === item.id) ? 'fill-current' : ''}`} />
            </button>
          )}
          {item.isCustom && (
            <>
              <button
                onClick={() => handleEditCustomTerm(item)}
                className="p-2 rounded-full text-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                title="용어 수정"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteCustomTerm(item.id)}
                className="p-2 rounded-full text-error-400 hover:text-error-600 hover:bg-error-50 transition-all"
                title="용어 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
      
      <p className="text-neutral-700 text-base mb-4 leading-relaxed">{item.definition}</p>
      
      <div className="border-t border-neutral-200 pt-4 mb-4">
        <p className="text-sm text-neutral-600 mb-3 font-medium">관련 표현:</p>
        <div className="flex flex-wrap gap-2">
          {item.examples.map((example, idx) => (
            <span key={idx} className="bg-neutral-100 text-neutral-700 px-3 py-2 rounded-full text-sm font-medium hover:bg-neutral-200 transition-colors">
              {example}
            </span>
          ))}
        </div>
      </div>

      {/* 법률/공식 문서 예문 표시 */}
      {item.legalExamples && item.legalExamples.length > 0 && (
        <div className="border-t border-neutral-200 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-primary-600" />
            <p className="text-sm text-primary-600 font-semibold">법률·공식문서 예문</p>
          </div>
          <div className="space-y-3">
            {item.legalExamples.map((example, idx) => (
              <div key={idx} className="legal-example">
                {example}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen transition-all duration-500"
      style={{
        background: theme === 'dark'
          ? 'linear-gradient(135deg, #1e3a8a 0%, #581c87 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: theme === 'dark' ? '#f8fafc' : '#1e293b'
      }}
    >
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-10 relative">
          {/* 미니멀 테마 토글 버튼 - 헤더 우상단 */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            title={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
            aria-label={`${theme === 'light' ? '다크' : '라이트'} 모드로 전환`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">특수교육 용어 사전</h1>
          <p className="text-white/90 text-lg font-medium">생활어를 전공어로 쉽게 변환하고 나만의 용어를 추가하세요</p>
          <div className="text-white/70 text-sm mt-2">v1.0.2 - 다크/라이트 테마 및 접근성 개선</div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            placeholder="생활어나 전공어를 검색해보세요... (예: 말더듬, ADHD)"
            className="input-field w-full pl-12 pr-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="tab-container flex mb-6">
          <button
            onClick={() => setActiveTab('search')}
            className={`tab-button flex-1 flex items-center justify-center gap-2 ${
              activeTab === 'search' ? 'active' : ''
            }`}
          >
            <Search className="w-4 h-4" />
            검색 결과
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`tab-button flex-1 flex items-center justify-center gap-2 ${
              activeTab === 'favorites' ? 'active' : ''
            }`}
          >
            <Star className="w-4 h-4" />
            즐겨찾기 ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`tab-button flex-1 flex items-center justify-center gap-2 ${
              activeTab === 'history' ? 'active' : ''
            }`}
          >
            <History className="w-4 h-4" />
            최근 검색
          </button>
          <button
            onClick={() => setActiveTab('wordlist')}
            className={`tab-button flex-1 flex items-center justify-center gap-2 ${
              activeTab === 'wordlist' ? 'active' : ''
            }`}
          >
            <List className="w-4 h-4" />
            단어 목록
          </button>
        </div>

        {/* 용어 추가 및 개선사항 제안 버튼 */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => setShowSuggestionModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            개선사항 제안
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-success flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            새 용어 추가
          </button>
        </div>

        <div className="card p-8">
          {activeTab === 'search' && (
            <div>
              {!searchTerm ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">용어를 검색해보세요</h3>
                  <p className="text-gray-500">생활어나 전공어를 입력하면 관련 정보를 찾아드립니다</p>
                  <p className="text-gray-400 text-sm mt-2">
                    총 {allTerms.length}개의 용어가 등록되어 있습니다 
                    (기본: {dictionary.length}개, 사용자 추가: {customTerms.length}개)
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">검색 결과가 없습니다</div>
                  <p className="text-gray-500">다른 키워드로 검색해보세요</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      '{searchTerm}'에 대한 검색 결과 {searchResults.length}개
                    </span>
                  </div>
                  {searchResults.map(item => (
                    <DictionaryCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">즐겨찾기가 비어있습니다</h3>
                  <p className="text-gray-500">자주 사용하는 용어를 즐겨찾기에 추가해보세요</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      즐겨찾기 {favorites.length}개
                    </span>
                  </div>
                  {favorites.map(item => (
                    <DictionaryCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              {searchHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-600 mb-2">검색 기록이 없습니다</h3>
                  <p className="text-neutral-500">용어를 검색하면 최근 검색어가 여기에 표시됩니다</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-neutral-500" />
                      <span className="text-lg font-semibold text-neutral-700">최근 검색어</span>
                      <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
                        {searchHistory.length}개
                      </span>
                    </div>
                    <button
                      onClick={clearSearchHistory}
                      className="text-error-500 hover:text-error-600 text-sm font-medium px-3 py-1 rounded-lg hover:bg-error-50 transition-all"
                    >
                      전체 삭제
                    </button>
                  </div>
                  <div className="grid gap-3">
                    {searchHistory.map((term, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 p-3 rounded-lg transition-all group">
                        <button
                          onClick={() => handleHistoryClick(term)}
                          className="flex-1 text-left text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                        >
                          <Search className="w-4 h-4 inline mr-2 text-neutral-400" />
                          {term}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromHistory(term);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-error-400 hover:text-error-600 hover:bg-error-50 rounded-full transition-all"
                          title="검색어 삭제"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'wordlist' && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <List className="w-5 h-5 text-primary-500" />
                <span className="text-lg font-semibold text-neutral-700">전체 단어 목록</span>
                <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
                  {allTerms.length}개
                </span>
              </div>

              {/* 장애 유형별 분류 */}
              {['언어장애', '정서행동장애', '지적장애', '발달장애', '학습장애', '법제도', '교육과정', '평가도구', '교수방법'].map(category => {
                const categoryTerms = allTerms.filter(term => term.category === category);
                if (categoryTerms.length === 0) return null;

                return (
                  <div key={category} className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-semibold text-sm">
                        {category}
                      </div>
                      <span className="text-sm text-neutral-500">
                        {categoryTerms.length}개
                      </span>
                    </div>

                    <div className="grid gap-4">
                      {categoryTerms.map(term => (
                        <div key={term.id} className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-primary-700 font-medium">{term.livingWord}</span>
                              <ArrowRight className="w-4 h-4 text-neutral-400" />
                              <span className="text-success-600 font-semibold">{term.professionalTerm}</span>
                              {term.isCustom && (
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                                  사용자 추가
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => toggleFavorite(term)}
                                className={`p-1 rounded transition-all ${
                                  favorites.some(fav => fav.id === term.id)
                                    ? 'text-warning-500 hover:text-warning-600'
                                    : 'text-neutral-400 hover:text-warning-500'
                                }`}
                                title="즐겨찾기"
                              >
                                <Star className={`w-4 h-4 ${favorites.some(fav => fav.id === term.id) ? 'fill-current' : ''}`} />
                              </button>
                              {term.isCustom && (
                                <>
                                  <button
                                    onClick={() => handleEditCustomTerm(term)}
                                    className="p-1 rounded text-primary-400 hover:text-primary-600 transition-all"
                                    title="편집"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCustomTerm(term.id)}
                                    className="p-1 rounded text-error-400 hover:text-error-600 transition-all"
                                    title="삭제"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {term.definition && (
                            <p className="text-sm text-neutral-600 mb-2">{term.definition}</p>
                          )}

                          {term.examples && term.examples.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {term.examples.map((example, idx) => (
                                <span key={idx} className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded text-xs">
                                  {example}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* 카테고리가 없는 용어들 */}
              {(() => {
                const uncategorizedTerms = allTerms.filter(term => !term.category || term.category === '');
                if (uncategorizedTerms.length === 0) return null;

                return (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full font-semibold text-sm">
                        기타
                      </div>
                      <span className="text-sm text-neutral-500">
                        {uncategorizedTerms.length}개
                      </span>
                    </div>

                    <div className="grid gap-4">
                      {uncategorizedTerms.map(term => (
                        <div key={term.id} className="bg-white border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <span className="text-primary-700 font-medium">{term.livingWord}</span>
                              <ArrowRight className="w-4 h-4 text-neutral-400" />
                              <span className="text-success-600 font-semibold">{term.professionalTerm}</span>
                              {term.isCustom && (
                                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                                  사용자 추가
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => toggleFavorite(term)}
                                className={`p-1 rounded transition-all ${
                                  favorites.some(fav => fav.id === term.id)
                                    ? 'text-warning-500 hover:text-warning-600'
                                    : 'text-neutral-400 hover:text-warning-500'
                                }`}
                                title="즐겨찾기"
                              >
                                <Star className={`w-4 h-4 ${favorites.some(fav => fav.id === term.id) ? 'fill-current' : ''}`} />
                              </button>
                              {term.isCustom && (
                                <>
                                  <button
                                    onClick={() => handleEditCustomTerm(term)}
                                    className="p-1 rounded text-primary-400 hover:text-primary-600 transition-all"
                                    title="편집"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCustomTerm(term.id)}
                                    className="p-1 rounded text-error-400 hover:text-error-600 transition-all"
                                    title="삭제"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {term.definition && (
                            <p className="text-sm text-neutral-600 mb-2">{term.definition}</p>
                          )}

                          {term.examples && term.examples.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {term.examples.map((example, idx) => (
                                <span key={idx} className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded text-xs">
                                  {example}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* 사용 도움말 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">사용 도움말</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• 일상 용어를 입력하면 관련된 전문 용어를 찾을 수 있습니다</li>
            <li>• 별표(⭐)를 클릭하면 즐겨찾기에 추가됩니다</li>
            <li>• '새 용어 추가' 버튼으로 나만의 용어를 등록할 수 있습니다</li>
            <li>• 법률·공식문서 예문으로 실제 활용 사례를 확인하세요</li>
            <li>• 현재 {allTerms.length}개의 특수교육 용어가 포함되어 있습니다</li>
          </ul>
        </div>
      </div>

      {/* 개선사항 제안 모달 */}
      {showSuggestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-neutral-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-600" />
                개선사항 제안
              </h3>
              <button
                onClick={() => setShowSuggestionModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  제안 유형 <span className="text-error-500">*</span>
                </label>
                <select
                  value={newSuggestion.type}
                  onChange={(e) => setNewSuggestion(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="improvement">개선사항</option>
                  <option value="bug">버그 신고</option>
                  <option value="feature">새 기능 요청</option>
                  <option value="content">용어 추가/수정 요청</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  제목 <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSuggestion.title}
                  onChange={(e) => setNewSuggestion(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="간단한 제목을 입력해주세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  상세 설명 <span className="text-error-500">*</span>
                </label>
                <textarea
                  value={newSuggestion.description}
                  onChange={(e) => setNewSuggestion(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="4"
                  placeholder="구체적인 내용을 입력해주세요"
                />
              </div>


              <div className="bg-primary-50 p-3 rounded-lg">
                <p className="text-sm text-primary-800">
                  💡 <strong>도움말:</strong> 구체적인 예시나 상황을 포함해서 작성해주시면 더 빠르고 정확한 개선이 가능합니다!
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={() => setShowSuggestionModal(false)}
                className="flex-1 px-4 py-2 text-neutral-600 border border-neutral-300 rounded-md hover:bg-neutral-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddSuggestion}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                제안하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 용어 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">새 용어 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  생활어 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTerm.livingWord}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, livingWord: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 말더듬"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전공어 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTerm.professionalTerm}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, professionalTerm: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 유창성 장애(Fluency Disorder)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <input
                  type="text"
                  value={newTerm.category}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 언어장애"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">정의</label>
                <textarea
                  value={newTerm.definition}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, definition: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="용어의 정의를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관련 표현</label>
                {newTerm.examples.map((example, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={example}
                      onChange={(e) => updateExample(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="관련 표현을 입력하세요"
                    />
                    {newTerm.examples.length > 1 && (
                      <button
                        onClick={() => removeExampleField(index)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addExampleField}
                  className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  관련 표현 추가
                </button>
              </div>
            </div>

            <div className="flex gap-2 p-4 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleAddCustomTerm}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 용어 수정 모달 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">용어 수정</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTerm(null);
                  setNewTerm({
                    livingWord: '',
                    professionalTerm: '',
                    category: '',
                    definition: '',
                    examples: ['']
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  생활어 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTerm.livingWord}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, livingWord: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 말더듬"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  전공어 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTerm.professionalTerm}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, professionalTerm: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 유창성 장애(Fluency Disorder)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <input
                  type="text"
                  value={newTerm.category}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 언어장애"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">정의</label>
                <textarea
                  value={newTerm.definition}
                  onChange={(e) => setNewTerm(prev => ({ ...prev, definition: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="용어의 정의를 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">관련 표현</label>
                {newTerm.examples.map((example, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={example}
                      onChange={(e) => updateExample(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="관련 표현을 입력하세요"
                    />
                    {newTerm.examples.length > 1 && (
                      <button
                        onClick={() => removeExampleField(index)}
                        className="text-red-500 hover:text-red-700 px-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addExampleField}
                  className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  관련 표현 추가
                </button>
              </div>
            </div>

            <div className="flex gap-2 p-4 border-t">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTerm(null);
                  setNewTerm({
                    livingWord: '',
                    professionalTerm: '',
                    category: '',
                    definition: '',
                    examples: ['']
                  });
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleUpdateCustomTerm}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialEducationDictionary;