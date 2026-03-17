import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { ArrowLeft, Plus, Search, Trash2, Dumbbell, Timer, TrendingUp, Activity } from 'lucide-react';
import { Badge } from '../components/ui/badge';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  workoutType: 'strength' | 'cardio' | 'flexibility';
  time: string;
}

export default function FitnessLog() {
  const navigate = useNavigate();
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: '',
    workoutType: 'strength' as 'strength' | 'cardio' | 'flexibility',
  });

  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Bench Press',
      sets: 4,
      reps: 10,
      weight: 135,
      workoutType: 'strength',
      time: '9:15 AM',
    },
    {
      id: '2',
      name: 'Running',
      sets: 1,
      reps: 0,
      duration: 30,
      workoutType: 'cardio',
      time: '10:00 AM',
    },
    {
      id: '3',
      name: 'Squats',
      sets: 3,
      reps: 12,
      weight: 185,
      workoutType: 'strength',
      time: '9:45 AM',
    },
  ]);

  const totalExercises = exercises.length;
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const strengthExercises = exercises.filter(ex => ex.workoutType === 'strength').length;
  const cardioExercises = exercises.filter(ex => ex.workoutType === 'cardio').length;
  const totalDuration = exercises.reduce((sum, ex) => sum + (ex.duration || 0), 0);

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    
    const exerciseEntry: Exercise = {
      id: Date.now().toString(),
      name: newExercise.name,
      sets: parseInt(newExercise.sets),
      reps: parseInt(newExercise.reps),
      weight: newExercise.weight ? parseFloat(newExercise.weight) : undefined,
      duration: newExercise.duration ? parseFloat(newExercise.duration) : undefined,
      workoutType: newExercise.workoutType,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setExercises([...exercises, exerciseEntry]);
    setNewExercise({
      name: '',
      sets: '',
      reps: '',
      weight: '',
      duration: '',
      workoutType: 'strength',
    });
    setIsAddingExercise(false);
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cardio':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'flexibility':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
              <Dumbbell className="size-6 text-emerald-600" />
              <h1 className="text-2xl font-bold text-emerald-600">Fitness Log</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Daily Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="size-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Exercises</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{totalExercises}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="size-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">Total Sets</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">{totalSets}</p>
                  </div>
                </div>

                {/* Workout Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">Workout Breakdown</h4>
                  
                  {/* Strength */}
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-900">Strength Training</span>
                    <span className="text-lg font-bold text-blue-900">{strengthExercises}</span>
                  </div>

                  {/* Cardio */}
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium text-red-900">Cardio</span>
                    <span className="text-lg font-bold text-red-900">{cardioExercises}</span>
                  </div>

                  {/* Duration */}
                  {totalDuration > 0 && (
                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Timer className="size-4 text-amber-700" />
                        <span className="text-sm font-medium text-amber-900">Duration</span>
                      </div>
                      <span className="text-lg font-bold text-amber-900">{totalDuration} min</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="p-3 bg-linear-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                    <p className="text-sm font-medium text-purple-900 mb-1">Keep it up! 💪</p>
                    <p className="text-xs text-purple-700">
                      You've logged {totalExercises} exercises today
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exercise List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Add */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  placeholder="Search exercises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-emerald-600"
                />
              </div>
              <Button
                onClick={() => setIsAddingExercise(true)}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Plus className="size-4" />
                Add Exercise
              </Button>
            </div>

            {/* Add Exercise Form */}
            {isAddingExercise && (
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle>Add New Exercise</CardTitle>
                  <CardDescription>Log your workout details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddExercise} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="exercise-name">Exercise Name</Label>
                      <Input
                        id="exercise-name"
                        placeholder="e.g., Bench Press"
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Workout Type</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'strength', label: 'Strength' },
                          { value: 'cardio', label: 'Cardio' },
                          { value: 'flexibility', label: 'Flexibility' },
                        ].map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setNewExercise({ ...newExercise, workoutType: type.value as any })}
                            className={`p-2 border-2 rounded-lg text-sm transition-all ${
                              newExercise.workoutType === type.value
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sets">Sets</Label>
                        <Input
                          id="sets"
                          type="number"
                          placeholder="0"
                          value={newExercise.sets}
                          onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reps">Reps</Label>
                        <Input
                          id="reps"
                          type="number"
                          placeholder="0"
                          value={newExercise.reps}
                          onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (lbs) - Optional</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="0"
                          value={newExercise.weight}
                          onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (min) - Optional</Label>
                        <Input
                          id="duration"
                          type="number"
                          placeholder="0"
                          value={newExercise.duration}
                          onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 gap-2">
                        Add Exercise
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddingExercise(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Exercises */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Workout</CardTitle>
                <CardDescription>All exercises logged for today</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredExercises.length > 0 ? (
                  <div className="space-y-3">
                    {filteredExercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className={`p-3 rounded-lg ${getWorkoutTypeColor(exercise.workoutType)}`}>
                          <Dumbbell className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900">{exercise.name}</h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {exercise.workoutType}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-slate-600">
                            <span>{exercise.sets} sets</span>
                            <span>{exercise.reps} reps</span>
                            {exercise.weight && <span className="font-medium text-slate-900">{exercise.weight} lbs</span>}
                            {exercise.duration && (
                              <span className="flex items-center gap-1">
                                <Timer className="size-3" />
                                {exercise.duration} min
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{exercise.time}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExercise(exercise.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Dumbbell className="size-16 mx-auto mb-4 opacity-20" />
                    <p>No exercises logged yet</p>
                    <Button
                      variant="ghost"
                      onClick={() => setIsAddingExercise(true)}
                      className="mt-4"
                    >
                      Log your first exercise
                    </Button>
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
