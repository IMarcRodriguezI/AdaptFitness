import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { ArrowLeft, Calculator, TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function CalorieCalculator() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    sex: '',
    activityLevel: '',
    goal: '',
  });

  const [results, setResults] = useState<{
    bmr: number;
    maintenance: number;
    weightLoss: number;
    weightGain: number;
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();

    const age = parseFloat(formData.age);
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);

    // Mifflin-St Jeor Equation for BMR
    let bmr: number;
    if (formData.sex === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers: { [key: string]: number } = {
      inactive: 1.2,
      'somewhat-active': 1.375,
      active: 1.55,
      'very-active': 1.725,
    };

    const maintenance = bmr * activityMultipliers[formData.activityLevel];
    const weightLoss = maintenance - 500; // 500 calorie deficit for ~1lb/week loss
    const weightGain = maintenance + 300; // 300 calorie surplus for controlled gain

    setResults({
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenance),
      weightLoss: Math.round(weightLoss),
      weightGain: Math.round(weightGain),
    });
  };

  const isFormValid = () => {
    return (
      formData.age &&
      formData.height &&
      formData.weight &&
      formData.sex &&
      formData.activityLevel &&
      formData.goal
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Calculator className="size-6 text-emerald-600" />
              <h1 className="text-2xl font-bold text-emerald-600">Calorie Calculator</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                  Enter your details to calculate your daily calorie needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={calculateCalories} className="space-y-6">
                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (years)</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      min="15"
                      max="100"
                      required
                    />
                  </div>

                  {/* Sex */}
                  <div className="space-y-2">
                    <Label>Sex</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('sex', 'male')}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          formData.sex === 'male'
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        Male
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('sex', 'female')}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          formData.sex === 'female'
                            ? 'border-emerald-600 bg-emerald-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      min="120"
                      max="250"
                      required
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      min="30"
                      max="300"
                      step="0.1"
                      required
                    />
                  </div>

                  {/* Activity Level */}
                  <div className="space-y-2">
                    <Label>Activity Level</Label>
                    <div className="space-y-2">
                      {[
                        { value: 'inactive', label: 'Inactive', desc: 'Little or no exercise' },
                        { value: 'somewhat-active', label: 'Somewhat Active', desc: '1-3 days/week' },
                        { value: 'active', label: 'Active', desc: '3-5 days/week' },
                        { value: 'very-active', label: 'Very Active', desc: '6-7 days/week' },
                      ].map((activity) => (
                        <button
                          key={activity.value}
                          type="button"
                          onClick={() => handleInputChange('activityLevel', activity.value)}
                          className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                            formData.activityLevel === activity.value
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-medium">{activity.label}</div>
                          <div className="text-sm text-slate-600">{activity.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Goal */}
                  <div className="space-y-2">
                    <Label>Goal</Label>
                    <div className="space-y-2">
                      {[
                        { value: 'lose', label: 'Lose Weight', icon: TrendingDown },
                        { value: 'maintain', label: 'Maintain Weight', icon: Minus },
                        { value: 'gain', label: 'Gain Weight', icon: TrendingUp },
                      ].map((goal) => (
                        <button
                          key={goal.value}
                          type="button"
                          onClick={() => handleInputChange('goal', goal.value)}
                          className={`w-full p-3 border-2 rounded-lg flex items-center gap-3 transition-all ${
                            formData.goal === goal.value
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <goal.icon className="size-5" />
                          <span className="font-medium">{goal.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={!isFormValid()}
                  >
                    Calculate Calories
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            <Card className={results ? 'border-emerald-200' : ''}>
              <CardHeader>
                <CardTitle>Your Results</CardTitle>
                <CardDescription>
                  {results
                    ? 'Based on your information and activity level'
                    : 'Complete the form to see your personalized calorie recommendations'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <div className="space-y-6">
                    {/* BMR */}
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-600 mb-1">Basal Metabolic Rate (BMR)</div>
                      <div className="text-3xl font-bold text-slate-900">{results.bmr}</div>
                      <div className="text-sm text-slate-500">calories/day at rest</div>
                    </div>

                    {/* Maintenance Calories */}
                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Minus className="size-4 text-blue-600" />
                        <div className="text-sm font-medium text-blue-900">Maintain Weight</div>
                      </div>
                      <div className="text-3xl font-bold text-blue-900">{results.maintenance}</div>
                      <div className="text-sm text-blue-700">calories/day</div>
                    </div>

                    {/* Weight Loss */}
                    <div className={`p-4 rounded-lg border-2 ${
                      formData.goal === 'lose' 
                        ? 'bg-emerald-50 border-emerald-600' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className={`size-4 ${
                          formData.goal === 'lose' ? 'text-emerald-600' : 'text-orange-600'
                        }`} />
                        <div className={`text-sm font-medium ${
                          formData.goal === 'lose' ? 'text-emerald-900' : 'text-orange-900'
                        }`}>
                          Lose Weight
                          {formData.goal === 'lose' && ' (Recommended)'}
                        </div>
                      </div>
                      <div className={`text-3xl font-bold ${
                        formData.goal === 'lose' ? 'text-emerald-900' : 'text-orange-900'
                      }`}>
                        {results.weightLoss}
                      </div>
                      <div className={`text-sm ${
                        formData.goal === 'lose' ? 'text-emerald-700' : 'text-orange-700'
                      }`}>
                        calories/day (~0.5kg/week loss)
                      </div>
                    </div>

                    {/* Weight Gain */}
                    <div className={`p-4 rounded-lg border-2 ${
                      formData.goal === 'gain' 
                        ? 'bg-emerald-50 border-emerald-600' 
                        : 'bg-purple-50 border-purple-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className={`size-4 ${
                          formData.goal === 'gain' ? 'text-emerald-600' : 'text-purple-600'
                        }`} />
                        <div className={`text-sm font-medium ${
                          formData.goal === 'gain' ? 'text-emerald-900' : 'text-purple-900'
                        }`}>
                          Gain Weight
                          {formData.goal === 'gain' && ' (Recommended)'}
                        </div>
                      </div>
                      <div className={`text-3xl font-bold ${
                        formData.goal === 'gain' ? 'text-emerald-900' : 'text-purple-900'
                      }`}>
                        {results.weightGain}
                      </div>
                      <div className={`text-sm ${
                        formData.goal === 'gain' ? 'text-emerald-700' : 'text-purple-700'
                      }`}>
                        calories/day (controlled gain)
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-900">
                        <strong>Note:</strong> These are estimates based on general formulas. 
                        Consult with a healthcare professional for personalized advice.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <Calculator className="size-16 mx-auto mb-4 opacity-20" />
                    <p>Your calorie recommendations will appear here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
