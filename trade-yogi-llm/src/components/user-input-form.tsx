'use client';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useState} from 'react';

interface UserInputFormProps {
  onSubmit: (userVector: number[]) => void;
}

export const UserInputForm: React.FC<UserInputFormProps> = ({onSubmit}) => {
  const [goal, setGoal] = useState<string>('');
  const [risk, setRisk] = useState<string>('');
  const [freq, setFreq] = useState<string>('');
  const [assetsInput, setAssetsInput] = useState<string>('');
  const [vol, setVol] = useState<string>('');
  const [horizon, setHorizon] = useState<string>('');
  const [decision, setDecision] = useState<string>('');
  const [emotion, setEmotion] = useState<string>('');
  const [capital, setCapital] = useState<string>('');
  const [style, setStyle] = useState<string>('');

  const assetOptions = [
    'Stocks (Large-cap)',
    'Stocks (Mid-cap)',
    'Stocks (Small-cap)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      goal === '' ||
      risk === '' ||
      freq === '' ||
      assetsInput === '' ||
      vol === '' ||
      horizon === '' ||
      decision === '' ||
      emotion === '' ||
      capital === '' ||
      style === ''
    ) {
      alert('Please fill in all fields.');
      return;
    }

    let assetsIndices: number[] = [];
    try {
      assetsIndices = assetsInput.split(',').map((x) => parseInt(x.trim()));
      if (assetsIndices.some((index) => index < 0 || index >= assetOptions.length)) {
        throw new Error('Asset indices are out of range.');
      }
    } catch (error) {
      alert('Invalid asset indices. Please enter comma-separated numbers within the valid range.');
      return;
    }

    const assetsVector = assetOptions.map((_, i) => (assetsIndices.includes(i) ? 1 : 0));

    const userVector: number[] = [
      parseInt(goal),
      parseInt(risk),
      parseInt(freq),
      ...assetsVector,
      parseInt(vol),
      parseInt(horizon),
      parseInt(decision),
      parseInt(emotion),
      parseInt(capital),
      parseInt(style),
    ];

    onSubmit(userVector);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="goal" className="mb-1 block text-[12px]">
          1. Primary goal?
        </Label>
        <select
          id="goal"
          className="w-full p-2 border rounded mt-2 opacity-80"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >
          <option value="" disabled>
            Select Goal
          </option>
          <option value="0">Wealth Creation</option>
          <option value="1">Passive Income</option>
          <option value="2">Short-Term Gains</option>
          <option value="3">Learning</option>
        </select>
      </div>
      <div>
        <Label htmlFor="risk" className="mb-1 block text-[12px]">
          2. Risk tolerance?
        </Label>
        <select
          id="risk"
          className="w-full p-2 border rounded mt-2 opacity-80"
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
        >
          <option value="" disabled>
            Select Risk Tolerance
          </option>
          <option value="0">Conservative</option>
          <option value="1">Moderate</option>
          <option value="2">Aggressive</option>
          <option value="3">Speculative</option>
        </select>
      </div>
      <div>
        <Label htmlFor="freq" className="mb-1 block text-[12px]">
          3. How often do you trade?
        </Label>
        <select
          id="freq"
          className="w-full p-2 border rounded mt-2 opacity-80"
          value={freq}
          onChange={(e) => setFreq(e.target.value)}
        >
          <option value="" disabled>
            Select Trading Frequency
          </option>
          <option value="0">Daily</option>
          <option value="1">Weekly</option>
          <option value="2">Monthly</option>
          <option value="3">Occasionally</option>
        </select>
      </div>
      <div>
        <Label htmlFor="assets" className="mb-1 block text-[12px]">
          4. Select interested assets (comma-separated numbers):
          <ul className="mt-1 list-disc list-inside space-y-2">
            <li>
              0: Stocks (Large-cap)
            </li>
            <li>
              1: Stocks (Mid-cap)
            </li>
            <li>
              2: Stocks (Small-cap)
            </li>
          </ul>
        </Label>
        <Input
          type="text"
          id="assets"
          className="w-full p-2 border rounded mt-2"
          placeholder="e.g., 0, 1, 2"
          value={assetsInput}
          onChange={(e) => setAssetsInput(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="vol" className="mb-1 block text-[12px]">
          5. Reaction to volatility?
        </Label>
        <select
          id="vol"
          className="w-full p-2 border rounded mt-2 opacity-80"
          value={vol}
          onChange={(e) => setVol(e.target.value)}
        >
          <option value="" disabled>
            Select Volatility Reaction
          </option>
          <option value="0">Hold</option>
          <option value="1">Buy the dip</option>
          <option value="2">Sell to cut losses</option>
          <option value="3">Hedge</option>
        </select>
      </div>
      <div>
        <Label htmlFor="horizon" className="mb-1 block text-[12px]">
          6. Investment horizon?
        </Label>
        <select
          id="horizon"
          className="w-full p-2 border rounded mt-2 opacity-80"
          value={horizon}
          onChange={(e) => setHorizon(e.target.value)}
        >
          <option value="" disabled>
            Select Investment Horizon
          </option>
          <option value="0">&lt;1 month</option>
          <option value="1">1–6 months</option>
          <option value="2">6m–3yrs</option>
          <option value="3">3+ years</option>
        </select>
      </div>
      <div>
        <Label htmlFor="decision" className="mb-1 block text-[12px]">
          7. How do you make trading decisions?
        </Label>
        <select
          id="decision"
          className="w-full p-2 border rounded mt-2 opacity-80"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
        >
          <option value="" disabled>
            Select Decision Making Process
          </option>
          <option value="0">Technical</option>
          <option value="1">Fundamental</option>
          <option value="2">News</option>
          <option value="3">Social Media</option>
          <option value="4">Algo/Bot</option>
        </select>
      </div>
      <div>
        <Label htmlFor="emotion" className="mb-1 block text-[12px]">
          8. Emotion driving trades?
        </Label>
        <select
          id="emotion"
          className="w-full p-2 border rounded mt-2 opacity-80"
          value={emotion}
          onChange={(e) => setEmotion(e.target.value)}
        >
          <option value="" disabled>
            Select Emotion
          </option>
          <option value="0">Confidence</option>
          <option value="1">Fear</option>
          <option value="2">Greed</option>
          <option value="3">FOMO</option>
        </select>
      </div>
      <div>
        <Label htmlFor="capital" className="mb-1 block text-[12px]">
          9. Capital to start?
        </Label>
        <select
          id="capital"
          className="w-full p-2 border rounded mt-2 opacity-80"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
        >
          <option value="" disabled>
            Select Capital
          </option>
          <option value="0">&lt;10k</option>
          <option value="1">10k–50k</option>
          <option value="2">50k–2L</option>
          <option value="3">&gt;2L</option>
        </select>
      </div>
      <div>
        <Label htmlFor="style" className="mb-1 block text-[12px]">
          10. Manual or automated?
        </Label>
        <select
          id="style"
          className="w-full p-2 border rounded mt-2 opacity-80"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          <option value="" disabled>
            Select Style
          </option>
          <option value="0">Fully Auto</option>
          <option value="1">Semi-Auto</option>
          <option value="2">Manual</option>
        </select>
      </div>
      <div className="text-center">
        <Button type="submit" className="mt-2 justify-center">
          Get Recommendations
        </Button>
      </div>
    </form>
  );
};
