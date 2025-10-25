import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, FileText, ExternalLink } from 'lucide-react';
import emailjs from '@emailjs/browser';

export default function Portfolio() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const margin = 0.15;
    const chartWidth = canvas.width * 0.7;
    const chartHeight = canvas.height * 0.7;
    
    const negativeRatio = 0.15;
    
    const originX = canvas.width * margin + chartWidth * negativeRatio;
    const originY = canvas.height * (1 - margin) - chartHeight * negativeRatio;

    const numPoints = 100;

    const curves = [
      {
        name: 'Normal Distribution',
        fn: (x) => {
          const mean = 0.5;
          const std = 0.15;
          return Math.exp(-Math.pow(x - mean, 2) / (2 * std * std));
        }
      },
      {
        name: 'Exponential Decay',
        fn: (x) => Math.exp(-x * 3)
      },
      {
        name: 'Sigmoid',
        fn: (x) => 1 / (1 + Math.exp(-12 * (x - 0.5)))
      },
      {
        name: 'Exponential Growth',
        fn: (x) => Math.exp(x * 3) / Math.exp(3)
      },
      {
        name: 'Logarithmic',
        fn: (x) => x > 0 ? Math.log(x * 10 + 1) / Math.log(11) : 0
      },
      {
        name: 'Polynomial Cubic',
        fn: (x) => Math.pow(x, 3)
      },
      {
        name: 'Sine Wave',
        fn: (x) => 0.5 + 0.4 * Math.sin(x * Math.PI * 4)
      },
      {
        name: 'Damped Oscillation',
        fn: (x) => Math.exp(-x * 2) * Math.cos(x * Math.PI * 6) * 0.5 + 0.5
      }
    ];

    let currentCurveIndex = 0;
    let animationPhase = 'drawing';
    let progress = 0;
    const drawSpeed = 0.01;
    const holdTime = 60;
    const eraseSpeed = 0.015;
    let holdCounter = 0;

    function generatePoints(curveFn) {
      const points = [];
      for (let i = 0; i <= numPoints; i++) {
        const x = i / numPoints;
        const y = curveFn(x);
        points.push({ x, y });
      }
      return points;
    }

    let currentPoints = generatePoints(curves[currentCurveIndex].fn);

    function drawAxes() {
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.lineWidth = 2;

      const negativeLength = chartWidth * negativeRatio;
      const positiveXLength = chartWidth * (1 - negativeRatio);
      const positiveYLength = chartHeight * (1 - negativeRatio);

      const xAxisLeft = originX - negativeLength;
      const xAxisRight = originX + positiveXLength;
      
      ctx.beginPath();
      ctx.moveTo(xAxisLeft, originY);
      ctx.lineTo(xAxisRight, originY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(xAxisRight, originY);
      ctx.lineTo(xAxisRight - 10, originY - 5);
      ctx.lineTo(xAxisRight - 10, originY + 5);
      ctx.closePath();
      ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.fill();

      const yAxisBottom = originY + negativeLength;
      const yAxisTop = originY - positiveYLength;
      
      ctx.beginPath();
      ctx.moveTo(originX, yAxisBottom);
      ctx.lineTo(originX, yAxisTop);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(originX, yAxisTop);
      ctx.lineTo(originX - 5, yAxisTop + 10);
      ctx.lineTo(originX + 5, yAxisTop + 10);
      ctx.closePath();
      ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
      ctx.fill();
    }

    function drawCurve(points, startProgress, endProgress) {
      if (endProgress <= startProgress) return;

      const startIndex = Math.floor(startProgress * points.length);
      const endIndex = Math.ceil(endProgress * points.length);
      const visiblePoints = points.slice(startIndex, endIndex);

      if (visiblePoints.length < 2) return;

      const drawWidth = chartWidth * (1 - negativeRatio);
      const drawHeight = chartHeight * (1 - negativeRatio);

      ctx.beginPath();
      ctx.moveTo(originX + visiblePoints[0].x * drawWidth, originY);
      visiblePoints.forEach(point => {
        ctx.lineTo(
          originX + point.x * drawWidth,
          originY - point.y * drawHeight
        );
      });
      ctx.lineTo(
        originX + visiblePoints[visiblePoints.length - 1].x * drawWidth,
        originY
      );
      ctx.closePath();
      ctx.fillStyle = 'rgba(34, 211, 238, 0.1)';
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.beginPath();
      ctx.moveTo(
        originX + visiblePoints[0].x * drawWidth,
        originY - visiblePoints[0].y * drawHeight
      );
      visiblePoints.forEach(point => {
        ctx.lineTo(
          originX + point.x * drawWidth,
          originY - point.y * drawHeight
        );
      });
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    function animate() {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawAxes();

      if (animationPhase === 'drawing') {
        drawCurve(currentPoints, 0, progress);
        progress += drawSpeed;
        
        if (progress >= 1) {
          progress = 1;
          animationPhase = 'holding';
          holdCounter = 0;
        }
      } else if (animationPhase === 'holding') {
        drawCurve(currentPoints, 0, 1);
        holdCounter++;
        
        if (holdCounter >= holdTime) {
          animationPhase = 'erasing';
          progress = 0;
        }
      } else if (animationPhase === 'erasing') {
        drawCurve(currentPoints, progress, 1);
        progress += eraseSpeed;
        
        if (progress >= 1) {
          currentCurveIndex = (currentCurveIndex + 1) % curves.length;
          currentPoints = generatePoints(curves[currentCurveIndex].fn);
          animationPhase = 'drawing';
          progress = 0;
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const skills = [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'Firebase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { name: 'Supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
    { name: 'Salesforce', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/salesforce/salesforce-original.svg' },
    { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
    { name: 'Excel', icon: 'https://img.icons8.com/color/96/microsoft-excel-2019--v1.png' }
  ];

  const experiences = [
    {
      period: 'May 2024 – Aug 2024',
      title: 'IT Intern',
      company: 'The Welcoming Center',
      location: 'Philadelphia, PA',
      link: 'https://www.linkedin.com/posts/jie-huang-nb_last-week-i-finished-my-internship-at-the-activity-7232550885933957120-nPaW?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADfJqcQB63tUk9hpuwQBM_8EyGl51zr2mV8',
      points: [
        'Retrieved and managed 100+ survey data records and 400+ collector data records from Survey Monkey using Python in Zapier Action, transferring them to Salesforce for further processing',
        'Created and structured objects/tables in Salesforce to store and organize survey and collector data, ensuring smooth integration between Survey Monkey and Salesforce through API connections',
        'Developed and tested SOQL scripts and APEX code of trigger handlers to enhance data integration for the ESOL project, maintaining consistent data management across all Salesforce systems'
      ],
      tags: ['Zapier', 'Python', 'Salesforce', 'SOQL', 'APEX']
    },
    {
      period: 'Jan 2024 – Apr 2024',
      title: 'Database Intern',
      company: 'Philadelphia Chinatown Development Corporation',
      location: 'Philadelphia, PA',
      points: [
        'Collaborated with the Volunteer Income Tax Assistance (VITA) team during the ongoing tax season by responding to admin inquiries and analyzing database issues to support tax filing operations',
        'Debugged and optimized automation workflows in Airtable based on team feedback, resolving errors and refining trigger conditions to ensure smooth data processing throughout the tax filing process',
        'Refined database structure and UI design according to the VITA team\'s suggestions, streamlining the client information verification process and workflow, and improving the tax preparation efficiency'
      ],
      tags: ['Airtable', 'Database']
    },
    {
      period: 'Jun 2023 – Aug 2023',
      title: 'Database Assistant Intern',
      company: 'Philadelphia Chinatown Development Corporation',
      location: 'Philadelphia, PA',
      points: [
        'Managed and organized Volunteer Income Tax Assistance (VITA) databases using Airtable by designing relational schemas, configuring automation workflows, and maintaining data integrity',
        'Established relationships between tables by linking primary and foreign keys, and improved the efficiency of the tax report process through methods such as sorting, filtering, and data matching',
        'Enhanced client experience by designing a friendly UI for the request forms, and advanced the security of the tax report process for 600+ clients through triggers with specific condition filters'
      ],
      tags: ['Airtable', 'Database']
    }
  ];

  const projects = [
    {
      period: 'Jul 2025 – Oct 2025',
      title: 'Smart MathCalc',
      type: 'Chrome Extension',
      location: 'Philadelphia, PA',
      link: 'https://chromewebstore.google.com/detail/smart-mathcalc/ecjmjnemmpkadompcmmkakcmciibopoc',
      points: [
        'Developed a Chrome extension using JavaScript and Chrome APIs to detect mathematical content on webpages through regex pattern matching, automatically displaying a floating calculator interface',
        'Integrated WolframAlpha API for computational capabilities spanning basic arithmetic, algebra, calculus, and linear algebra with natural language query processing support and error handling',
        'Implemented draggable UI with 50+ mathematical function buttons, smart operation detection for contextual input assistance, and optimized DOM monitoring through debounced MutationObserver'
      ],
      tags: ['JavaScript', 'Chrome API', 'WolframAlpha API']
    },
    {
      period: 'Jan 2025 – May 2025',
      title: 'Lux AI',
      type: 'Kaggle Competition',
      location: 'Philadelphia, PA',
      link: 'https://github.com/JayTSXF/Lux-AI',
      points: [
        'Developed a reinforcement learning agent for the Lux AI Season 3 competition using PPO, handling resource management and unit control under partial observability with custom observation masking',
        'Implemented custom reward shaping and observation processing to address training instability from early-iteration data, tuning hyperparameters, and adjusting policies to improve agent performance',
        'Deployed and trained the agent on cloud virtual machine using JAX and Flax for parallel environment simulation, running training over multiple weeks across thousands of episodes to optimize decisions'
      ],
      tags: ['Python', 'Reinforcement Learning', 'PPO', 'JAX', 'Flax', 'Cloud Computing']
    },
    {
      period: 'Oct 2024 – Dec 2024',
      title: 'Grind Daily',
      type: 'Web Application',
      location: 'Philadelphia, PA',
      link: 'https://grinddaily.onrender.com/',
      points: [
        'Leveraged MongoDB to construct a relational schema that streamlined data storage and retrieval, enhancing system scalability, efficiency, and adaptability for user operations across various contexts',
        'Engineered the "Forgot Password" feature using EmailJS in JavaScript to securely automate email verification and password reset processes, ensuring account security and safeguarding user privacy',
        'Implemented the "Friend" feature backend using Node.js to handle friend list queries, manage accept and decline request workflows, process real-time interactions, and maintain friend relationship data'
      ],
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'EmailJS']
    },
    {
      period: 'Jan 2024 – May 2024',
      title: 'Natural Language Processing for Disaster Tweet',
      type: 'Machine Learning Model',
      location: 'Philadelphia, PA',
      link: 'https://github.com/AndyWang506/NLP-for-Disaster-Tweet',
      points: [
        'Developed a machine learning model to categorize tweets as disaster-related or not, enhancing the efficiency of identifying critical information during emergencies and speeding up response times',
        'Utilized Term Frequency-Inverse Document Frequency (TF-IDF) to preprocess and normalize the text data, enabling the model to accurately interpret and analyze the content for better performance',
        'Applied k-NN, Logistic Regression, and k-means algorithms to evaluate the model\'s performance, providing the model with more accuracy and adaptability to various types of data and situations'
      ],
      tags: ['Python', 'Machine Learning', 'NLP', 'TF-IDF', 'k-NN', 'Logistic Regression']
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
      background: '#000000'
    }}>
      <canvas 
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/30 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-cyan-400">JH</div>
          <div className="flex space-x-6">
            <a href="https://www.linkedin.com/in/jie-huang-nb" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com/JayTSXF" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              <Github size={24} />
            </a>
            <a href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" className="hover:text-cyan-400 transition-colors">
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
              <p className="text-cyan-400 text-lg mb-4">Hello, I am</p>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
                Jie Huang
              </h1>
              <h2 className="text-2xl md:text-3xl text-cyan-300 mb-8 font-light">
                Welcome to My Portfolio
              </h2>
              <p className="text-slate-300 text-[15px] leading-relaxed max-w-xl mb-6">
                I immigrated from China to the U.S. during high school, an experience that sparked my passion for technology as a universal language. I recently graduated from Temple University with a B.S. in Computer Science and Data Science, ready to apply my cross-cultural perspective to innovative problem-solving.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 rounded-full border-4 border-cyan-400 overflow-hidden shadow-2xl shadow-cyan-500/50">
                <img 
                  src={`${import.meta.env.BASE_URL}profile.jpg`}
                  alt="Jie Huang Profile" 
                  className="w-full h-full object-cover"
                />
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
                  <div className="w-20 h-20 bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-cyan-500/30 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50 hover:border-cyan-400 flex items-center justify-center">
                    <img 
                      src={skill.icon} 
                      alt={skill.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="mt-3 text-slate-300 font-medium text-sm">{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="py-20 px-6">
          <div className="max-w-[745px] mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-white drop-shadow-lg">
              Experience
            </h2>
            <div className="space-y-10">
              {experiences.map((exp, index) => {
                const hasLink = exp.link;
                const Component = hasLink ? 'a' : 'div';
                const linkProps = hasLink ? {
                  href: exp.link,
                  target: '_blank',
                  rel: 'noopener noreferrer'
                } : {};

                return (
                  <Component
                    key={index}
                    {...linkProps}
                    className={`group bg-slate-800/20 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 block ${hasLink ? 'cursor-pointer' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-cyan-300">{exp.company}</h3>
                        {hasLink && <ExternalLink size={16} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </div>
                      <p className="text-cyan-400 text-sm">{exp.location}</p>
                    </div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-cyan-300">{exp.title}</h4>
                    <p className="text-cyan-400 text-sm">{exp.period}</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {exp.points.map((point, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start">
                        <span className="text-cyan-400 mr-2 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-cyan-500/10 text-cyan-300 rounded-full text-xs border border-cyan-400/30 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Component>
              );
              })}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 px-6">
          <div className="max-w-[745px] mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-white drop-shadow-lg">
              Projects
            </h2>
            <div className="space-y-10">
              {projects.map((project, index) => (
                <a 
                  key={index}
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="group bg-slate-800/20 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 block cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-cyan-300">{project.type}</h3>
                      <ExternalLink size={16} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-cyan-400 text-sm">{project.location}</p>
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-base font-bold text-cyan-300">{project.title}</h4>
                    <p className="text-cyan-400 text-sm">{project.period}</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {project.points.map((point, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-start">
                        <span className="text-cyan-400 mr-2 mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-cyan-500/10 text-cyan-300 rounded-full text-xs border border-cyan-400/30 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6">
          <div className="max-w-[745px] mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-white drop-shadow-lg">
              Contact Me
            </h2>
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 bg-slate-800/50 text-white rounded-lg border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-slate-400 backdrop-blur-sm"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 bg-slate-800/50 text-white rounded-lg border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-slate-400 backdrop-blur-sm"
              />
              <textarea
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={6}
                className="w-full px-6 py-4 bg-slate-800/50 text-white rounded-lg border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent resize-none placeholder-slate-400 backdrop-blur-sm"
              />
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="px-12 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/50"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-cyan-500/20">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-slate-400 text-sm">
              © 2025 Jie Huang. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(34, 211, 238, 0.3) transparent;
        }
      `}</style>
    </div>
  );
}