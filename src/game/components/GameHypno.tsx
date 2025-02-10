import styled from 'styled-components';
import { useSetting, useTranslate } from '../../settings';
import { GameHypnoType, HypnoPhrases } from '../../types';
import { useLooping } from '../../utils';
import { GamePhase, useGameValue } from '../GameProvider';
import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

const StyledGameHypno = motion(styled.div`
  pointer-events: none;
  font-size: 4rem;
  font-weight: bold;
  -webkit-text-stroke: black 1.5px;
  color: white;
`);

export const GameHypno = () => {
  const [hypno] = useSetting('hypno');
  const [current, setCurrent] = useGameValue('currentHypno');
  const [phase] = useGameValue('phase');
  const [intensity] = useGameValue('intensity');
  const translate = useTranslate();

  const phrase = useMemo(() => {
    const phrases = HypnoPhrases[hypno];
    if (phrases.length <= 0) return '';
    return translate(phrases[current % phrases.length]);
  }, [current, hypno, translate]);

  const onTick = useCallback(() => {
    setCurrent(Math.floor(Math.random() * HypnoPhrases[hypno].length));
  }, [hypno, setCurrent]);

  const delay = 3000;

  const enabled = useMemo(
    () => phase === GamePhase.active && hypno !== GameHypnoType.off,
    [phase, hypno]
  );

  useLooping(onTick, delay, enabled);

  return (
    <StyledGameHypno
      key={phrase}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{
        ease: [0.4, 1, 0.8, 1],
        duration: delay * 0.001 * 1.2,
      }}
    >
      {phrase}
    </StyledGameHypno>
  );
};
