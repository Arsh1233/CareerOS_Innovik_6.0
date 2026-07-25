import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GraduationCap, Link2, Code2, Check, Building2, Globe } from 'lucide-react'
import { useRole } from '../context/RoleContext'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { userProfile, updateUserProfile } = useRole()
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    fullName: userProfile.fullName || '',
    phone: userProfile.phone || '',
    universityName: userProfile.universityName || '',
    universityEmail: userProfile.universityEmail || '',
    degree: userProfile.degree || '',
    graduationYear: userProfile.graduationYear || '2026',
    cgpa: userProfile.cgpa || '8.5',
    githubUrl: userProfile.githubUrl || '',
    leetcodeUrl: userProfile.leetcodeUrl || '',
    linkedinUrl: userProfile.linkedinUrl || '',
    portfolioUrl: userProfile.portfolioUrl || '',
    codeforcesHandle: userProfile.codeforcesHandle || '',
    targetRole: userProfile.targetRole || 'Full Stack & AI Engineer',
    bio: userProfile.bio || '',
    skills: ['React', 'Python', 'TypeScript', 'Node.js', 'Machine Learning'] as string[]
  })

  const commonSkills = [
    'React', 'Node.js', 'Python', 'Java', 'C++', 'AWS', 'Docker', 'SQL', 
    'TypeScript', 'Figma', 'Machine Learning', 'Data Structures', 'System Design', 'FastAPI'
  ]

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Save all student profile fields into RoleContext & localStorage
      updateUserProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        universityName: formData.universityName,
        universityEmail: formData.universityEmail,
        degree: formData.degree,
        graduationYear: formData.graduationYear,
        cgpa: formData.cgpa,
        githubUrl: formData.githubUrl,
        leetcodeUrl: formData.leetcodeUrl,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        codeforcesHandle: formData.codeforcesHandle,
        targetRole: formData.targetRole,
        bio: formData.bio
      })
      navigate('/dashboard')
    }
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
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8" style={{ background: 'var(--bg-base)' }}>
      {/* Background radial blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-125 h-125 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-125 h-125 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl relative overflow-hidden rounded-3xl p-6 md:p-10 z-10"
        style={{ 
          background: 'var(--bg-surface-strong)',
          border: '1px solid var(--border-accent)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(30px)'
        }}
      >
        {/* Step Indicator Header */}
        <div className="flex justify-between items-center mb-10 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 rounded-full z-0" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full z-0 transition-all duration-500" 
            style={{ 
              background: 'linear-gradient(90deg, #3B82F6, #10B981)',
              width: `${((step - 1) / 2) * 100}%` 
            }} 
          />
          
          {[
            { step: 1, label: 'University Details' },
            { step: 2, label: 'GitHub & Coding Links' },
            { step: 3, label: 'Career Goals' }
          ].map(item => (
            <div key={item.step} className="flex flex-col items-center gap-2 z-10">
              <div 
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300
                  ${step >= item.step 
                    ? 'bg-linear-to-r from-blue-600 to-emerald-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105' 
                    : 'bg-[#1E293B] text-slate-500'}`}
                style={{ border: `1px solid ${step >= item.step ? 'transparent' : 'var(--border)'}` }}
              >
                {step > item.step ? <Check size={18} /> : item.step}
              </div>
              <span className="text-[11px] font-medium hidden sm:block" style={{ color: step >= item.step ? '#3B82F6' : 'var(--text-3)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Form Steps */}
        <AnimatePresence mode="wait">
          {/* STEP 1: Academic & University Info */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 bg-blue-500/10 text-blue-400">
                  <GraduationCap size={28} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>
                  University & Personal Information
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
                  Enter your academic details and university credentials for campus placement ranking.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Full Name *</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="e.g. Arsh Chakraborty"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Phone Number *</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+91 8269766043"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>University / College Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={formData.universityName}
                      onChange={(e) => setFormData({...formData, universityName: e.target.value})}
                      placeholder="e.g. Indian Institute of Technology, Delhi"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>University Official Email *</label>
                  <input 
                    type="email" 
                    value={formData.universityEmail}
                    onChange={(e) => setFormData({...formData, universityEmail: e.target.value})}
                    placeholder="arsh@iitd.ac.in"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Degree / Major *</label>
                  <input 
                    type="text" 
                    value={formData.degree}
                    onChange={(e) => setFormData({...formData, degree: e.target.value})}
                    placeholder="B.Tech Computer Science (AI)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Graduation Year</label>
                  <input 
                    type="text" 
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({...formData, graduationYear: e.target.value})}
                    placeholder="2026"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-2)' }}>Current CGPA / GPA</label>
                  <input 
                    type="text" 
                    value={formData.cgpa}
                    onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                    placeholder="8.9"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Coding & Social Links */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 bg-emerald-500/10 text-emerald-400">
                  <Link2 size={28} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>
                  Coding Profiles & Links
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
                  Add your GitHub, LeetCode, LinkedIn & portfolio for automated skill verification.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">GitHub Profile URL *</label>
                  <div className="relative">
                    <Code2 className="absolute left-3.5 top-3 w-4 h-4 text-emerald-400" />
                    <input 
                      type="url" 
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      placeholder="https://github.com/Arsh1233"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">LeetCode Profile / Username *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-amber-400">LC</span>
                    <input 
                      type="text" 
                      value={formData.leetcodeUrl}
                      onChange={(e) => setFormData({...formData, leetcodeUrl: e.target.value})}
                      placeholder="https://leetcode.com/Arsh1233 or Arsh1233"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">LinkedIn Profile URL *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-blue-400">in</span>
                    <input 
                      type="url" 
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})}
                      placeholder="https://linkedin.com/in/arsh1233"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-slate-300">Codeforces / CodeChef Handle</label>
                    <input 
                      type="text" 
                      value={formData.codeforcesHandle}
                      onChange={(e) => setFormData({...formData, codeforcesHandle: e.target.value})}
                      placeholder="e.g. arsh_master"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1.5 text-slate-300">Personal Portfolio / Website</label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-3 w-4 h-4 text-cyan-400" />
                      <input 
                        type="url" 
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                        placeholder="https://arsh-portfolio.dev"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Career Goals & Core Skills */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 bg-purple-500/10 text-purple-400">
                  <Code2 size={28} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-1)', fontFamily: "'Poppins', sans-serif" }}>
                  Career Goal & Core Skills
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-2)', fontFamily: "'Inter', sans-serif" }}>
                  Define your primary target engineering role and technical expertise.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">Target Role / Job Title *</label>
                  <input 
                    type="text" 
                    value={formData.targetRole}
                    onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                    placeholder="e.g. Full Stack Engineer / AI Specialist"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-slate-300">Short Bio / Summary</label>
                  <textarea 
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Describe your technical interests, algorithms, and projects..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-2 text-slate-300">Select Primary Technical Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map(skill => {
                      const isSelected = formData.skills.includes(skill)
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                            isSelected 
                              ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white border border-blue-400/40 shadow-lg' 
                              : 'bg-slate-900/60 text-slate-300 border border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {skill}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
          <button 
            type="button"
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="px-6 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            {step === 1 ? 'Cancel' : '← Back'}
          </button>
          
          <button 
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xl transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #059669, #10B981)', boxShadow: '0 0 24px rgba(16,185,129,0.35)' }}
          >
            {step === 3 ? '🎉 Complete Profile Setup' : 'Continue Step →'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
