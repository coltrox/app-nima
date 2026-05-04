import React, { useState } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, ScrollView, 
  TextInput, Dimensions, Animated 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, colors } from './styles';

const { width } = Dimensions.get('window');

const Questionario = ({ visible, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    // 1. Perfil e Rotina
    { id: 1, section: 'Perfil', type: 'select', question: 'Quanto tempo o animal ficará sozinho por dia?', options: ['Menos de 4 horas', 'Entre 4 e 8 horas', 'Mais de 8 horas'] },
    { id: 2, section: 'Perfil', type: 'select', question: 'Qual é o seu nível de energia?', options: ['Baixo', 'Moderado', 'Alto'] },
    { id: 3, section: 'Perfil', type: 'select', question: 'Frequência de passeios pretendida:', options: ['Nenhuma', 'Leve (1–2x/semana)', 'Moderada (3–5x/semana)', 'Intensa (todos os dias)'] },
    { id: 4, section: 'Perfil', type: 'input', question: 'Quem será o principal responsável?' },
    
    // 2. Ambiente
    { id: 5, section: 'Ambiente', type: 'select', question: 'Tipo da sua residência:', options: ['Casa com quintal grande', 'Casa com quintal pequeno', 'Apartamento com tela', 'Apartamento sem tela'] },
    { id: 6, section: 'Ambiente', type: 'select', question: 'O ambiente é seguro contra fugas?', options: ['Sim', 'Não'] },
    { id: 7, section: 'Ambiente', type: 'select', question: 'Acesso ao interior da casa?', options: ['Sim', 'Não'] },

    // 3. Família
    { id: 8, section: 'Família', type: 'select', question: 'Existem crianças na residência?', options: ['Sim', 'Não'] },
    { id: 9, section: 'Família', type: 'input', question: 'Se sim, qual a faixa etária das crianças?' },
    { id: 10, section: 'Família', type: 'input', question: 'Existem outros animais? (Porte/Comportamento)' },

    // 4. Preferências
    { id: 11, section: 'Preferências', type: 'select', question: 'Preferência de espécie:', options: ['Cachorro', 'Gato', 'Indiferente'] },
    { id: 12, section: 'Preferências', type: 'select', question: 'Porte preferido:', options: ['Pequeno', 'Médio', 'Grande', 'Indiferente'] },
    { id: 13, section: 'Preferências', type: 'select', question: 'Idade preferida:', options: ['Filhote', 'Adulto', 'Idoso'] },

    // 5. Saúde e Finanças
    { id: 14, section: 'Saúde', type: 'select', question: 'Alguém possui alergia a pelos?', options: ['Sim', 'Não'] },
    { id: 15, section: 'Finanças', type: 'select', question: 'Possui reserva para custos veterinários?', options: ['Sim', 'Não'] },

    // 6. Planejamento
    { id: 16, section: 'Planejamento', type: 'input', question: 'Viaja com frequência? O que fará com o animal?' },

    // 7. Experiência e Intenção
    { id: 17, section: 'Experiência', type: 'select', question: 'Já teve animais antes?', options: ['Sim', 'Não'] },
    { id: 18, section: 'Experiência', type: 'select', question: 'Classificação da sua experiência:', options: ['Nenhuma', 'Básica', 'Experiente'] },
    { id: 19, section: 'Intenção', type: 'input', question: 'Qual o principal motivo para adoção?' },
    { id: 20, section: 'Compromisso', type: 'select', question: 'Ciente da responsabilidade (10-15 anos)?', options: ['Sim', 'Não'] },
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const currentQ = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          {/* Header & Progresso */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={colors.navy} />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.stepText}>{currentStep + 1}/{questions.length}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.sectionLabel}>{currentQ.section}</Text>
            <Text style={styles.questionText}>{currentQ.question}</Text>

            {currentQ.type === 'select' ? (
              currentQ.options.map((option) => (
                <TouchableOpacity 
                  key={option}
                  style={[
                    styles.optionButton,
                    answers[currentQ.id] === option && styles.optionSelected
                  ]}
                  onPress={() => setAnswers({...answers, [currentQ.id]: option})}
                >
                  <Text style={[
                    styles.optionText,
                    answers[currentQ.id] === option && styles.optionTextSelected
                  ]}>{option}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Escreva aqui..."
                multiline
                value={answers[currentQ.id] || ''}
                onChangeText={(text) => setAnswers({...answers, [currentQ.id]: text})}
              />
            )}
          </ScrollView>

          {/* Navegação Inferior */}
          <View style={styles.footer}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.nextButton, !answers[currentQ.id] && styles.disabledButton]} 
              onPress={handleNext}
              disabled={!answers[currentQ.id]}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === questions.length - 1 ? 'Finalizar' : 'Próximo'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default Questionario;