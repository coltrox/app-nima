import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';

const RadioGroup = ({ options, selected, onSelect }) => (
  <View>
    {options.map((option) => {
      const isSelected = selected === option;
      return (
        <TouchableOpacity
          key={option}
          style={[styles.radioItem, isSelected && styles.radioItemSelected]}
          onPress={() => onSelect(option)}
          activeOpacity={0.7}
        >
          <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
            <View style={[styles.radioInner, isSelected && styles.radioInnerSelected]} />
          </View>
          <Text style={styles.optionLabel}>{option}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const CheckBoxGroup = ({ options, selected, onToggle }) => (
  <View>
    {options.map((option) => {
      const isChecked = selected.includes(option);
      return (
        <TouchableOpacity
          key={option}
          style={[styles.checkboxItem, isChecked && styles.checkboxItemSelected]}
          onPress={() => {
            const newSelected = isChecked
              ? selected.filter((item) => item !== option)
              : [...selected, option];
            onToggle(newSelected);
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.checkboxOuter, isChecked && styles.checkboxSelected]} />
          <Text style={styles.optionLabel}>{option}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const OnboardingForm = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const sections = [
    {
      title: 'Rotina',
      fields: [
        {
          name: 'tempo_sozinho',
          label: 'Tempo sozinho por dia',
          type: 'radio',
          options: ['Menos de 4 horas', '4 a 8 horas', 'Mais de 8 horas'],
          required: true,
        },
        {
          name: 'nivel_energia',
          label: 'Nível de energia do lar',
          type: 'radio',
          options: ['Baixo', 'Médio', 'Alto'],
          required: true,
        },
        {
          name: 'responsavel_principal',
          label: 'Nome do responsável principal',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      title: 'Ambiente',
      fields: [
        {
          name: 'tipo_residencia',
          label: 'Tipo de residência',
          type: 'radio',
          options: ['Casa com quintal', 'Apartamento', 'Casa sem quintal'],
          required: true,
        },
        {
          name: 'acesso_interno',
          label: 'Acesso interno à casa',
          type: 'radio',
          options: ['Sim (acesso livre)', 'Não (apenas área externa)'],
          required: true,
        },
      ],
    },
    {
      title: 'Família',
      fields: [
        {
          name: 'criancas_residencia',
          label: 'Há crianças na residência?',
          type: 'radio',
          options: ['Sim', 'Não'],
          required: true,
        },
        {
          name: 'faixa_etaria_criancas',
          label: 'Faixa etária das crianças',
          type: 'radio',
          options: ['0-5 anos', '6-12 anos', '13-17 anos', 'Nenhuma'],
          required: true,
        },
        {
          name: 'outros_animais',
          label: 'Outros animais em casa',
          type: 'checkbox',
          options: ['Cães', 'Gatos', 'Pássaros', 'Roedores', 'Peixes'],
          required: true,
        },
      ],
    },
    {
      title: 'Preferências',
      fields: [
        {
          name: 'especie_preferencia',
          label: 'Espécie preferida',
          type: 'radio',
          options: ['Cachorro', 'Gato', 'Ambos / Não importa'],
          required: true,
        },
        {
          name: 'porte_preferencia',
          label: 'Porte preferido',
          type: 'radio',
          options: ['Pequeno', 'Médio', 'Grande', 'Não importa'],
          required: true,
        },
        {
          name: 'idade_preferencia',
          label: 'Idade preferida',
          type: 'radio',
          options: ['Filhote (até 1 ano)', 'Adulto (1-7 anos)', 'Idoso (7+ anos)', 'Não importa'],
          required: true,
        },
      ],
    },
    {
      title: 'Saúde',
      fields: [
        {
          name: 'alergia_pelos',
          label: 'Alérgico a pelos?',
          type: 'radio',
          options: ['Sim', 'Não'],
          required: true,
        },
        {
          name: 'reserva_financeira',
          label: 'Reserva financeira para pet',
          type: 'radio',
          options: ['Baixa (menos de R$500/mês)', 'Média (R$500-2.000)', 'Alta (mais de R$2.000)'],
          required: true,
        },
        {
          name: 'plano_viagens',
          label: 'Planos de viagens',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ];

  const validateCurrent = () => {
    const section = sections[currentStep];
    for (const field of section.fields) {
      const val = formData[field.name];
      if (field.required) {
        if ((field.type === 'text' || field.type === 'textarea') && (!val || val.trim() === '')) {
          return false;
        }
        if (field.type === 'radio' && !val) {
          return false;
        }
        if (field.type === 'checkbox' && (!Array.isArray(val) || val.length === 0)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrent()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios desta seção.');
      return;
    }
    if (currentStep === sections.length - 1) {
      onComplete?.(formData);
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const renderField = (field) => {
    const fieldValue = formData[field.name] || (field.type === 'checkbox' ? [] : '');
    const updateField = (value) => {
      setFormData({ ...formData, [field.name]: value });
    };

    return (
      <View key={field.name} style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>
          {field.label}
          <Text style={styles.required}> *</Text>
        </Text>
        {field.type === 'radio' && (
          <RadioGroup
            options={field.options}
            selected={fieldValue}
            onSelect={updateField}
          />
        )}
        {field.type === 'checkbox' && (
          <CheckBoxGroup
            options={field.options}
            selected={fieldValue}
            onToggle={updateField}
          />
        )}
        {(field.type === 'text' || field.type === 'textarea') && (
          <TextInput
            style={[styles.textInput, field.type === 'textarea' && styles.textarea]}
            value={fieldValue}
            onChangeText={updateField}
            placeholder={`Digite sobre ${field.label.toLowerCase()}`}
            multiline={field.type === 'textarea'}
            numberOfLines={field.type === 'textarea' ? 4 : 1}
            textAlignVertical={field.type === 'textarea' ? 'top' : 'center'}
          />
        )}
      </View>
    );
  };

  const currentSection = sections[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{currentSection.title}</Text>
        <Text style={styles.stepIndicator}>Passo {currentStep + 1} de {sections.length}</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentStep + 1) / sections.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        {currentSection.fields.map(renderField)}
      </ScrollView>
      <View style={styles.footer}>
        {currentStep > 0 && (
          <View style={styles.navButtons}>
            <TouchableOpacity style={styles.btnSecondary} onPress={handlePrev}>
              <Text style={styles.btnTextSecondary}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
              <Text style={styles.btnTextPrimary}>
                {currentStep === sections.length - 1 ? 'Finalizar' : 'Próximo'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {currentStep === 0 && (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleNext}>
            <Text style={styles.btnTextPrimary}>Próximo</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.btnTertiary} onPress={() => setShowModal(true)}>
          <Text style={styles.btnTextTertiary}>Responder depois</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Responder depois?</Text>
            <Text style={styles.modalText}>
              Você perderá o progresso atual. Pode retomar o onboarding posteriormente.
            </Text>
            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalBtnSecondary}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalBtnTextSecondary}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtnPrimary}
                onPress={() => {
                  setShowModal(false);
                  // Aqui você pode adicionar lógica para sair do formulário
                }}
              >
                <Text style={styles.modalBtnTextPrimary}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepIndicator: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    width: '100%',
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: 24,
    paddingBottom: 150,
  },
  fieldContainer: {
    marginBottom: 32,
  },
  fieldLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
    lineHeight: 24,
  },
  required: {
    color: '#FF3B30',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  radioItemSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#EBF4FF',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  checkboxItemSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#EBF4FF',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  radioOuterSelected: {
    borderColor: '#007AFF',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  radioInnerSelected: {
    backgroundColor: '#FFFFFF',
  },
  checkboxOuter: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    marginRight: 16,
  },
  checkboxSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#EBF4FF',
  },
  optionLabel: {
    fontSize: 16,
    color: '#1D1D1F',
    fontWeight: '500',
    flex: 1,
  },
  textInput: {
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textarea: {
    height: 120,
    paddingVertical: 16,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  btnPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  btnSecondary: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTertiary: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  btnTextPrimary: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  btnTextSecondary: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  btnTextTertiary: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#48484A',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalBtnSecondary: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalBtnPrimary: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnTextSecondary: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  modalBtnTextPrimary: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default OnboardingForm;