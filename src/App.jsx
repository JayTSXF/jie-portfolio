import React, { useState, useEffect } from 'react';
import { Github, Linkedin, FileText } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Portfolio() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      // 只生成10个泡泡，避免聚集
      for (let i = 0; i < 10; i++) {
        const isLeft = i % 2 === 0;
        const left = isLeft 
          ? 5 + Math.random() * 10
          : 85 + Math.random() * 10;
        
        newBubbles.push({
          id: i,
          left: left,
          // 每个泡泡间隔3秒，加上i*20秒让它们初始就分散开
          delay: -20 + (i * 3)
        });
      }
      setBubbles(newBubbles);
    };
    generateBubbles();
  }, []);

  const skills = [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'Salesforce', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg' }
  ];

  const experiences = [
    {
      period: 'May 2024 – Aug 2024',
      title: 'IT Intern',
      company: 'The Welcoming Center',
      location: 'Philadelphia, PA',
      points: [
        'Retrieved and managed 100+ survey data records and 400+ collector data records from Survey Monkey using Python in Zapier Action, transferring them to Salesforce for further processing',
        'Created and structured objects/tables in Salesforce to store and organize survey and collector data, ensuring smooth integration between Survey Monkey and Salesforce through API connections',
        'Developed and tested SOQL scripts and APEX code of trigger handlers to enhance data integration for the ESOL project, maintaining consistent data management across all Salesforce systems'
      ],
      tags: ['Zapier', 'Python', 'Salesforce', 'SOQL', 'APEX']
    },
    {
      period: 'Jun 2023 – Aug 2023',
      title: 'Database Assistant Intern',
      company: 'Philadelphia Chinatown Development Corporation',
      location: 'Philadelphia, PA',
      points: [
        'Managed and organized Volunteer Income Tax Assistance (VITA) databases by using Airtable',
        'Established relationships between tables by linking primary and foreign keys, and improved the efficiency of the tax report process through methods such as sorting, filtering, and data matching',
        'Enhanced client experience by designing a friendly UI for the request forms, and advanced the security of the tax report process for 600+ clients through triggers with specific condition filters'
      ],
      tags: ['Airtable', 'Database']
    }
  ];

  const projects = [
    {
      period: 'Oct 2024 – Dec 2024',
      title: 'Grind Daily',
      type: 'Full-Stack Website',
      location: 'Philadelphia, PA',
      points: [
        'Leveraged MongoDB to construct a relational schema that streamlined data storage and retrieval, enhancing system scalability, efficiency, and adaptability for user operations across various contexts',
        'Engineered the "Forgot Password" feature using EmailJS in JavaScript to securely automate email verification and password reset processes, ensuring account security and safeguarding user privacy',
        'Optimized the back-end architecture for the "Friend" feature, enabling friend list displays, seamless request workflows, robust decline handling, and smoother interactions, enhancing the user experience'
      ],
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'EmailJS']
    }
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }
    
    const SERVICE_ID = 'service_8tq8xjl';  
    const TEMPLATE_ID = 'template_gz4s5ue'; 
    const PUBLIC_KEY = 'uvWiNhqJbdHLFIU5T';   
    
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      reply_to: formData.email
    };
    
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        console.error('Failed to send:', error);
        alert('Failed to send message. Please try again.');
      });
  };

  return (
    <div className="min-h-screen text-white overflow-hidden relative" style={{
      background: 'linear-gradient(to bottom, #005580 0%, #003d66 50%, #001a33 100%)'
    }}>
      {/* 泡泡背景 */}
      <div className="bubble-container">
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="bubble"
            style={{
              left: `${bubble.left}%`,
              animationDelay: `${bubble.delay}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-blue-950/50 backdrop-blur-sm border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-200">JH</div>
          <div className="flex space-x-6">
            <a href="https://www.linkedin.com/in/jie-huang-nb" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com/JayTSXF" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
              <Github size={24} />
            </a>
            <a href="/resume.pdf" target="_blank" className="hover:text-blue-300 transition-colors">
              <FileText size={24} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center px-6 pt-24">
          <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-blue-300 text-lg mb-4">Hello, I am</p>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
                Jie Huang
              </h1>
              <h2 className="text-2xl md:text-3xl text-blue-200 mb-8 font-light">
                Welcome to My Portfolio
              </h2>
              <p className="text-blue-100 leading-relaxed max-w-xl mb-6">
                I immigrated from China to the U.S. during high school, an experience that sparked my passion for technology as a universal language. I recently graduated from Temple University with a B.S. in Computer Science and Data Science, ready to apply my cross-cultural perspective to innovative problem-solving.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 rounded-full border-4 border-white bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-8xl font-bold shadow-2xl">
                JH
              </div>
            </div>
          </div>
        </section>

        {/* Programming Skills */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-white drop-shadow-lg">
              Programming Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              {skills.map((skill, index) => (
                <div key={index} className="group relative flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-blue-900/50 border-2 border-blue-400/30 flex items-center justify-center hover:border-blue-300 hover:scale-110 hover:bg-blue-800/50 transition-all duration-300 backdrop-blur-sm p-3">
                    <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain" />
                  </div>
                  <p className="text-center mt-2 text-sm text-blue-200 group-hover:text-blue-100 transition-colors">
                    {skill.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-20 px-6">
          <div className="max-w-[644px] mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-white drop-shadow-lg">
              Experience
            </h2>
            <div className="space-y-10">
              {experiences.map((exp, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-white">{exp.company}</h3>
                    <p className="text-blue-300 text-sm">{exp.location}</p>
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-white">{exp.title}</h4>
                    <p className="text-blue-300 text-sm">{exp.period}</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {exp.points.map((point, i) => (
                      <li key={i} className="text-blue-100 text-sm flex items-start">
                        <span className="text-blue-400 mr-2 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs border border-blue-400/30 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 px-6">
          <div className="max-w-[644px] mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-white drop-shadow-lg">
              Projects
            </h2>
            <div className="space-y-10">
              {projects.map((project, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-white">{project.type}</h3>
                    <p className="text-blue-300 text-sm">{project.location}</p>
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-white">{project.title}</h4>
                    <p className="text-blue-300 text-sm">{project.period}</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {project.points.map((point, i) => (
                      <li key={i} className="text-blue-100 text-sm flex items-start">
                        <span className="text-blue-400 mr-2 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-xs border border-blue-400/30 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6">
          <div className="max-w-[644px] mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-white drop-shadow-lg">
              Contact Me
            </h2>
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 bg-blue-50 text-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-400"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 bg-blue-50 text-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-400"
              />
              <textarea
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={6}
                className="w-full px-6 py-4 bg-blue-50 text-blue-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder-blue-400"
              />
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="px-12 py-4 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-blue-800/30">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-blue-300 text-sm">
              © 2025 Jie Huang. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

      <style>{`
        .bubble-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        
        @keyframes float-up {
          0% {
            bottom: -50px;
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            bottom: calc(100% + 50px);
            opacity: 0;
          }
        }
        
        .bubble {
          position: absolute;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          pointer-events: none;
          
          background: radial-gradient(circle at 30% 30%, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.03) 60%, 
            transparent 100%);
          
          border: 2.5px solid rgba(255, 255, 255, 0.7);
          
          box-shadow: 
            inset -4px -4px 8px rgba(255, 255, 255, 0.25),
            0 0 12px rgba(147, 247, 253, 0.25);
          
          animation: float-up 20s linear infinite;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.5);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.8);
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(96, 165, 250, 0.5) transparent;
        }
      `}</style>
    </div>
  );
}