import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, FileText, Code2, ArrowRight, Check, UploadCloud } from 'lucide-react'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    college: '',
    branch: '',
    gradYear: '',
    skills: [] as string[]
  })
  
  const commonSkills = [
    'React', 'Node.js', 'Python', 'Java', 'C++', 'AWS', 'Docker', 'SQL', 
    'TypeScript', 'Figma', 'Machine Learning', 'Data Structures'
  ]

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
    else navigate('/dashboard')
  }

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-base)' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative overflow-hidden rounded-3xl p-8"
        style={{ 
          background: 'var(--surface-dark)',
          border: '1px solid var(--border-light)'
        }}
      >
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-0 transition-all duration-500" 
            style={{ 
              background: 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
              width: `${((step - 1) / 2) * 100}%` 
            }} 
          />
          
          {[1, 2, 3].map(i => (
            <div 
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300
                ${step >= i ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-[#1E293B] text-slate-500'}`}
              style={{ border: `1px solid ${step >= i ? 'transparent' : 'var(--border-light)'}` }}
            >
              {step > i ? <Check size={18} /> : i}
            </div>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-blue-500/10 text-blue-400">
                  <GraduationCap size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to CareerOS</h2>
                <p className="text-slate-400">Let's set up your student profile.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">College / University</label>
                  <input 
                    type="text" 
                    value={formData.college}
                    onChange={(e) => setFormData({...formData, college: e.target.value})}
                    placeholder="e.g. Stanford University"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Branch / Major</label>
                    <input 
                      type="text" 
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                      placeholder="e.g. Computer Science"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Graduation Year</label>
                    <input 
                      type="number" 
                      value={formData.gradYear}
                      onChange={(e) => setFormData({...formData, gradYear: e.target.value})}
                      placeholder="e.g. 2026"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-purple-500/10 text-purple-400">
                  <FileText size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
                <p className="text-slate-400">We'll use AI to instantly build your Career Twin.</p>
              </div>

              <div 
                className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-purple-500/50 hover:bg-white/5 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud size={28} className="text-slate-400 group-hover:text-purple-400 transition-colors" />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">Click to upload or drag & drop</h3>
                <p className="text-sm text-slate-400">PDF or DOCX (max 5MB)</p>
              </div>
              
              <div className="text-center text-sm text-slate-500 pt-4">
                You can skip this and upload it later from your dashboard.
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-emerald-500/10 text-emerald-400">
                  <Code2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Select Core Skills</h2>
                <p className="text-slate-400">Select 3-5 skills you are most confident in.</p>
              </div>

              <div className="flex flex-wrap gap-3 justify-center max-w-lg mx-auto">
                {commonSkills.map(skill => {
                  const isSelected = formData.skills.includes(skill)
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${isSelected 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'}`}
                    >
                      {skill}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex justify-between items-center pt-6 border-t border-white/5">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="px-6 py-2.5 rounded-xl text-slate-300 hover:text-white transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
          >
            {step === 3 ? 'Complete Setup' : 'Continue'}
            {step < 3 && <ArrowRight size={18} />}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
