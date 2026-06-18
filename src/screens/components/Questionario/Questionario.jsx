import React, { useState, useRef } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, ScrollView, 
  TextInput, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform, Animated
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles, colors } from './styles';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Questionario = ({ visible, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef(null);

  const questions = [
    { id: 1, section: 'Perfil', icon: 'account-clock', type: 'select', question: 'Quanto tempo o animal ficará sozinho por dia?', options: ['Menos de 4 horas', 'Entre 4 e 8 horas', 'Mais de 8 horas'] },
    { id: 2, section: 'Perfil', icon: 'lightning-bolt', type: 'select', question: 'Qual é o seu nível de energia?', options: ['Baixo', 'Moderado', 'Alto'] },
    { id: 3, section: 'Perfil', icon: 'walk', type: 'select', question: 'Frequência de passeios pretendida:', options: ['Nenhuma', 'Leve (1–2x/semana)', 'Moderada (3–5x/semana)', 'Intensa (todos os dias)'] },
    { id: 4, section: 'Perfil', icon: 'account-check', type: 'input', question: 'Quem será o principal responsável?' },
    { id: 5, section: 'Ambiente', icon: 'home-variant', type: 'select', question: 'Tipo da sua residência:', options: ['Casa com quintal grande', 'Casa com quintal pequeno', 'Apartamento com tela', 'Apartamento sem tela'] },
    { id: 6, section: 'Ambiente', icon: 'shield-check', type: 'select', question: 'O ambiente é seguro contra fugas?', options: ['Sim', 'Não'] },
    { id: 7, section: 'Ambiente', icon: 'door-open', type: 'select', question: 'Acesso ao interior da casa?', options: ['Sim', 'Não'] },
    { id: 8, section: 'Família', icon: 'human-child', type: 'select', question: 'Existem crianças na residência?', options: ['Sim', 'Não'] },
    { id: 9, section: 'Família', icon: 'baby-face-outline', type: 'input', question: 'Qual a faixa etária das crianças?' },
    { id: 10, section: 'Família', icon: 'paw', type: 'input', question: 'Existem outros animais? Se sim, quais?' },
    { id: 11, section: 'Preferências', icon: 'heart', type: 'select', question: 'Preferência de espécie:', options: ['Cachorro', 'Gato', 'Indiferente'] },
    { id: 12, section: 'Preferências', icon: 'resize', type: 'select', question: 'Porte preferido:', options: ['Pequeno', 'Médio', 'Grande', 'Indiferente'] },
    { id: 13, section: 'Preferências', icon: 'calendar-range', type: 'select', question: 'Idade preferida:', options: ['Filhote', 'Adulto', 'Idoso'] },
    { id: 14, section: 'Saúde', icon: 'medical-bag', type: 'select', question: 'Alguém possui alergia a pelos?', options: ['Sim', 'Não'] },
    { id: 15, section: 'Finanças', icon: 'cash-multiple', type: 'select', question: 'Possui reserva para custos veterinários?', options: ['Sim', 'Não'] },
    { id: 16, section: 'Planejamento', icon: 'airplane', type: 'input', question: 'Viaja com frequência? O que fará com o animal?' },
    { id: 17, section: 'Experiência', icon: 'history', type: 'select', question: 'Já teve animais antes?', options: ['Sim', 'Não'] },
    { id: 18, section: 'Experiência', icon: 'star-circle', type: 'select', question: 'Classificação da sua experiência:', options: ['Nenhuma', 'Básica', 'Experiente'] },
    { id: 19, section: 'Intenção', icon: 'comment-question', type: 'input', question: 'Qual o motivo para adoção?' },
    { id: 20, section: 'Compromisso', icon: 'handshake', type: 'select', question: 'Ciente da responsabilidade (10-15 anos)?', options: ['Sim', 'Não'] },
  ];

  const currentQ = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const animateTransition = (callback) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      })
    ]).start();

    setTimeout(() => {
      callback();
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }, 120);
  };

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentQ.id]: option });
  };

  const handleNext = () => {
    if (currentQ.id === 8 && answers[8] === 'Não') {
      animateTransition(() => setCurrentStep(currentStep + 2));
      return;
    }

    if (currentStep < questions.length - 1) {
      animateTransition(() => setCurrentStep(currentStep + 1));
    } else {
      // Cria uma estrutura limpa associando a pergunta com a resposta dada
      const relatorioCompleto = questions.map(q => ({
        id: q.id,
        secao: q.section,
        pergunta: q.question,
        resposta: answers[q.id] || (q.id === 9 && answers[8] === 'Não' ? 'Não se aplica' : '')
      }));

      console.log("==================================================");
      console.log("📋 QUESTÕES E RESPOSTAS DO QUESTIONÁRIO:");
      console.log("==================================================");
      console.log(JSON.stringify(relatorioCompleto, null, 2));
      console.log("==================================================");
      
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentQ.id === 10 && answers[8] === 'Não') {
      animateTransition(() => setCurrentStep(currentStep - 2));
      return;
    }

    if (currentStep > 0) {
      animateTransition(() => setCurrentStep(currentStep - 1));
    }
  };

  const isCurrentAnswered = answers[currentQ.id] !== undefined && answers[currentQ.id] !== '';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.container}>
          <View style={styles.topIndicator} />

          <View style={styles.header}>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={colors.navy} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.laterText}>Responder depois</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.progressWrapper}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>{currentQ.section}</Text>
                <Text style={styles.progressSteps}>{currentStep + 1}/{questions.length}</Text>
              </View>
              <View style={styles.progressContainer}>
                <LinearGradient
                  colors={[colors.blue, '#6366F1']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${progress}%` }]}
                />
              </View>
            </View>
          </View>

          <ScrollView 
            ref={scrollViewRef}
            contentContainerStyle={styles.content} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              <View style={styles.questionCard}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons 
                    name={currentQ.icon} 
                    size={SCREEN_HEIGHT * 0.038} 
                    color={colors.blue} 
                  />
                </View>
                <Text style={styles.questionText}>{currentQ.question}</Text>
              </View>

              <View style={styles.optionsWrapper}>
                {currentQ.type === 'select' ? (
                  currentQ.options.map((option) => {
                    const isSelected = answers[currentQ.id] === option;
                    return (
                      <TouchableOpacity 
                        key={option}
                        activeOpacity={0.7}
                        style={[
                          styles.optionButton,
                          isSelected && styles.optionSelected
                        ]}
                        onPress={() => handleOptionSelect(option)}
                      >
                        <Text style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected
                        ]}>{option}</Text>
                        <View style={[styles.customRadio, isSelected && styles.customRadioSelected]}>
                          {isSelected && <View style={styles.customRadioInner} />}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder="Toque aqui para responder..."
                    placeholderTextColor={colors.gray}
                    multiline
                    value={answers[currentQ.id] || ''}
                    onChangeText={(text) => setAnswers({...answers, [currentQ.id]: text})}
                  />
                )}
              </View>
            </Animated.View>
          </ScrollView>

          <SafeAreaView style={styles.footer}>
            <TouchableOpacity 
              style={[styles.navButton, currentStep === 0 && { opacity: 0 }]} 
              onPress={handleBack}
              disabled={currentStep === 0}
            >
              <Ionicons name="arrow-back" size={18} color={colors.gray} />
              <Text style={styles.navButtonText}>Anterior</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.mainButton}
              onPress={handleNext}
              disabled={!isCurrentAnswered}
            >
              <LinearGradient
                colors={isCurrentAnswered ? [colors.blue, '#4F46E5'] : ['#E2E8F0', '#CBD5E1']}
                style={styles.mainButtonGradient}
              >
                <Text style={[styles.mainButtonText, !isCurrentAnswered && { color: colors.gray }]}>
                  {currentStep === questions.length - 1 ? 'Finalizar' : 'Avançar'}
                </Text>
                {isCurrentAnswered && currentStep !== questions.length - 1 && (
                  <Ionicons name="arrow-forward" size={18} color={colors.white} style={{ marginLeft: 6 }} />
                )}
              </LinearGradient>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default Questionario;