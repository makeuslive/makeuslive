// Script to add case studies to MongoDB
// Run with: npx ts-node scripts/add-case-studies.ts

const caseStudies = [
  {
    title: "Internal Ticket & SLA Management System",
    category: "Web Development",
    description: `A production-ready internal workflow platform built to manage tickets, projects, and SLA commitments across multi-role engineering and operations teams.

**The Problem**
Architectural and engineering teams faced delays and inefficiencies due to scattered communication, unclear ticket ownership, missed SLA commitments, and limited visibility into project status across departments.

**Our Solution**
• Implemented strict role-based access control for clarity and accountability
• Designed SLA timers aligned with business hours (not simple timestamps)
• Built role-specific dashboards instead of one-size-fits-all interfaces
• Centralized comments and file attachments to prevent context loss

**The Impact**
✓ Clear ownership of tickets across teams
✓ Consistent SLA monitoring with automated tracking
✓ Reduced manual coordination and follow-ups
✓ A system teams rely on daily without workarounds

This project demonstrates translating complex business workflows into reliable software systems that multiple teams depend on.`,
    tags: ["FastAPI", "Python", "MongoDB", "Next.js", "TypeScript", "JWT Auth", "Role-Based Access"],
    stats: {
      metric1: { label: "Teams Served", value: "5+" },
      metric2: { label: "Daily Active Users", value: "50+" },
      metric3: { label: "SLA Compliance", value: "98%" }
    },
    order: 0
  },
  {
    title: "Real-Time Distraction Alert Mobile App",
    category: "Mobile App",
    description: `A production-grade mobile application that detects user distraction near roadways and triggers intelligent safety alerts in real time.

**The Problem**
Distracted phone usage near roads poses serious safety risks. Existing solutions failed to run reliably in the background, drained battery excessively, generated frequent false alerts, or required constant user interaction.

**Our Solution**
• Implemented persistent background service for uninterrupted tracking
• Used distance-based GPS filtering to reduce battery consumption
• Combined GPS, activity recognition, and device state to minimize false positives
• Added alert cooldown logic to avoid notification fatigue
• Designed graceful failure handling for connectivity issues

**The Impact**
✓ Reliable background operation during extended usage
✓ Context-aware alerts (not constant notifications)
✓ Stable performance across devices
✓ Ready for safety-critical mobile use cases

This project showcases building mobile applications that operate under real-world constraints where reliability and correctness matter most.`,
    tags: ["Flutter", "Background Services", "GPS", "Real-Time Alerts", "Activity Recognition", "Battery Optimization"],
    stats: {
      metric1: { label: "Battery Impact", value: "<5%" },
      metric2: { label: "False Positive Rate", value: "<2%" },
      metric3: { label: "Uptime", value: "99.9%" }
    },
    order: 1
  },
  {
    title: "DocIt – Secure Document Locker",
    category: "Mobile App",
    description: `A secure mobile document locker that allows users to scan, store, and manage sensitive documents with offline access. Live on Google Play with real users.

**The Problem**
Users needed a secure, organized way to manage important documents (IDs, passports, bills, certificates) without relying on physical copies or constant internet access. Security, privacy, and offline availability were critical.

**Our Solution**
• End-to-end Flutter development with secure storage architecture
• Document scanning, categorization, and offline-first design
• Optimized image storage balancing quality and device constraints
• Expiry alerts and smart reminders for document renewal
• Full compliance with app store privacy and data safety requirements

**The Impact**
✓ Live production app on Google Play
✓ 10K+ downloads with 4.4★ user rating
✓ Active real-world usage for managing sensitive documents
✓ Continuous updates driven by user feedback

This demonstrates ownership of a production mobile application with real users, security-sensitive data, and long-term maintenance—essential for fintech and enterprise solutions.`,
    tags: ["Flutter", "Secure Storage", "Document Scanning", "Offline-First", "Privacy Compliance", "Production App"],
    stats: {
      metric1: { label: "Downloads", value: "10K+" },
      metric2: { label: "Rating", value: "4.4★" },
      metric3: { label: "Status", value: "Live" }
    },
    order: 2
  }
];

async function addCaseStudies() {
  const baseUrl = 'http://localhost:3000';
  
  for (const study of caseStudies) {
    try {
      const response = await fetch(`${baseUrl}/api/admin/works`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(study),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✓ Created: ${study.title}`);
      } else {
        console.error(`✗ Failed: ${study.title}`, data.error);
      }
    } catch (error) {
      console.error(`✗ Error creating ${study.title}:`, error);
    }
  }
  
  console.log('\nDone! Check your admin panel at /admin/works');
}

addCaseStudies();
