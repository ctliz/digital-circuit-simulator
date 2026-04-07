import { useState } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { useI18n } from '../i18n';
import { X, ChevronRight, ChevronLeft, Play, MousePointer, Link2 } from 'lucide-react';

export function Tutorial() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { clear } = useCircuitStore();
  const { t } = useI18n();

  const tutorialSteps = [
    {
      title: t('tutorial.welcome.title'),
      content: t('tutorial.welcome.content'),
      image: '👋',
      tipKey: null,
    },
    {
      title: t('tutorial.addComponent.title'),
      content: t('tutorial.addComponent.content'),
      image: '🔧',
      tipKey: 'tutorial.clickToAdd',
    },
    {
      title: t('tutorial.connect.title'),
      content: t('tutorial.connect.content'),
      image: '🔗',
      tipKey: 'tutorial.dragToConnect',
    },
    {
      title: t('tutorial.toggle.title'),
      content: t('tutorial.toggle.content'),
      image: '🖱️',
      tipKey: null,
    },
    {
      title: t('tutorial.simulate.title'),
      content: t('tutorial.simulate.content'),
      image: '▶️',
      tipKey: 'tutorial.startSimulation',
    },
    {
      title: t('tutorial.start.title'),
      content: t('tutorial.start.content'),
      image: '🎓',
      tipKey: null,
    },
  ];

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleStart = () => {
    clear();
    setIsVisible(false);
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <button className="tutorial-close" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="tutorial-step">
          <span className="tutorial-badge">
            {t('tutorial.step', { current: currentStep + 1, total: tutorialSteps.length })}
          </span>
        </div>

        <div className="tutorial-icon">{step.image}</div>

        <h2 className="tutorial-title">{step.title}</h2>
        <p className="tutorial-content">{step.content}</p>

        <div className="tutorial-features">
          {step.tipKey && (
            <div className="tutorial-tip">
              {step.tipKey === 'tutorial.clickToAdd' && <MousePointer size={16} />}
              {step.tipKey === 'tutorial.dragToConnect' && <Link2 size={16} />}
              {step.tipKey === 'tutorial.startSimulation' && <Play size={16} />}
              <span>{t(step.tipKey)}</span>
            </div>
          )}
          {currentStep === 5 && (
            <div className="tutorial-circuit">
              <div className="circuit-example">
                <span className="node-mini input">IN1</span>
                <span className="arrow">→</span>
                <span className="node-mini and">&</span>
                <span className="arrow">→</span>
                <span className="node-mini output">OUT</span>
              </div>
              <div className="circuit-example">
                <span className="node-mini input">IN2</span>
                <span className="arrow">↘</span>
              </div>
            </div>
          )}
        </div>

        <div className="tutorial-navigation">
          <button
            className="tutorial-btn secondary"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={18} />
            {t('tutorial.prev')}
          </button>

          {isLastStep ? (
            <button className="tutorial-btn primary" onClick={handleStart}>
              {t('tutorial.startUsing')}
              <Play size={18} />
            </button>
          ) : (
            <button className="tutorial-btn primary" onClick={handleNext}>
              {t('tutorial.next')}
              <ChevronRight size={18} />
            </button>
          )}
        </div>

        <div className="tutorial-dots">
          {tutorialSteps.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentStep ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}