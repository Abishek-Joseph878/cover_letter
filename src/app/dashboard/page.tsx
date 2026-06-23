"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import styles from "./dashboard.module.css";

interface CoverLetter {
  _id: string;
  title: string;
  jobTitle: string;
  company: string;
  jobDescription?: string;
  resumeText?: string;
  generatedContent: string;
  tone?: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formId, setFormId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formJobTitle, setFormJobTitle] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formTone, setFormTone] = useState("Professional");
  const [formJobDesc, setFormJobDesc] = useState("");
  const [formResume, setFormResume] = useState("");
  const [formContent, setFormContent] = useState("");

  // Fetch cover letters
  const fetchLetters = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cover-letters");
      const data = await res.json();
      if (data.success) {
        setCoverLetters(data.data);
        if (data.data.length > 0 && !selectedLetter) {
          setSelectedLetter(data.data[0]);
        }
      } else {
        setError(data.error || "Failed to load cover letters");
      }
    } catch (err) {
      setError("An error occurred while fetching cover letters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLetters();
  }, []);

  // Trigger client-side mock AI generation based on details
  const handleAutoGenerate = () => {
    if (!formJobTitle || !formCompany) {
      alert("Please provide at least a Job Title and Company Name to generate a template.");
      return;
    }

    const userName = user?.name || "Candidate Name";
    const date = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let intro = "";
    let body = "";
    let conclusion = "";

    switch (formTone) {
      case "Enthusiastic":
        intro = `Dear Hiring Team at ${formCompany},\n\nI was absolutely thrilled to see the opening for the ${formJobTitle} position! As a highly motivated professional who follows ${formCompany}'s innovations, this opportunity represents the perfect intersection of my skill set and my passion.`;
        body = `Based on my background, I have developed a strong foundation that fits the needs of your team. I pride myself on rapid learning, proactive problem solving, and bringing positive energy to every sprint. In my previous experiences, I've successfully tackled challenges similar to the ones outlined in your job description, and I'm eager to bring that same drive to ${formCompany}.`;
        conclusion = `Thank you so much for your time and consideration. I would love the opportunity to discuss how my enthusiasm and expertise can contribute to your goals!`;
        break;
      case "Concise":
        intro = `Dear Hiring Manager,\n\nPlease accept this application for the ${formJobTitle} role at ${formCompany}.`;
        body = `With my experience in this domain, I have developed key competencies that match your requirements. I focus on delivering high-quality results efficiently, maintaining clean workflows, and collaborating effectively across teams. I am confident that my technical skills will translate directly into immediate value for the ${formJobTitle} team.`;
        conclusion = `I look forward to discussing my credentials with you in an interview. Thank you for your consideration.`;
        break;
      case "Confident":
        intro = `Dear Hiring Committee at ${formCompany},\n\nI am writing to express my strong interest in the ${formJobTitle} role. With a proven track record of engineering solutions and driving results, I am uniquely positioned to excel in this capacity and elevate the performance of your team.`;
        body = `My experience matches the core requirements of this role. I specialize in designing scalable systems, optimizing operational efficiency, and leading critical features from conception to launch. I don't just solve problems; I align engineering strategies with business outcomes to build high-impact products.`;
        conclusion = `I welcome the opportunity to meet and demonstrate how my skillset will directly contribute to ${formCompany}'s ongoing success.`;
        break;
      default: // Professional
        intro = `Dear Hiring Manager at ${formCompany},\n\nI am writing to express my interest in the ${formJobTitle} position currently open at ${formCompany}. With a solid background in development and a dedication to operational excellence, I am confident in my ability to make a meaningful contribution to your organization.`;
        body = `Throughout my career, I have honed my technical skills and demonstrated a strong capacity for cross-functional collaboration. The challenges detailed in your job posting align closely with my expertise. I am eager to apply my experience in problem-solving and clean design to support the growth of the team.`;
        conclusion = `Thank you for reviewing my application. I look forward to the possibility of discussing how my qualifications align with the needs of ${formCompany}.`;
    }

    const generated = `${userName}\n${date}\n\n${intro}\n\n${body}\n\n${conclusion}\n\nSincerely,\n${userName}`;
    setFormContent(generated);
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormId("");
    setFormTitle("");
    setFormJobTitle("");
    setFormCompany("");
    setFormTone("Professional");
    setFormJobDesc("");
    setFormResume("");
    setFormContent("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (letter: CoverLetter) => {
    setIsEditing(true);
    setFormId(letter._id);
    setFormTitle(letter.title);
    setFormJobTitle(letter.jobTitle);
    setFormCompany(letter.company);
    setFormTone(letter.tone || "Professional");
    setFormJobDesc(letter.jobDescription || "");
    setFormResume(letter.resumeText || "");
    setFormContent(letter.generatedContent);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cover letter?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/cover-letters/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCoverLetters((prev) => prev.filter((item) => item._id !== id));
        if (selectedLetter?._id === id) {
          setSelectedLetter(null);
        }
        alert("Cover letter deleted successfully");
      } else {
        alert(data.error || "Failed to delete cover letter");
      }
    } catch (err) {
      alert("An error occurred during deletion");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formJobTitle || !formCompany || !formContent) {
      alert("Please fill in all required fields (Title, Job Title, Company, and Content).");
      return;
    }

    setActionLoading(true);
    const payload = {
      title: formTitle,
      jobTitle: formJobTitle,
      company: formCompany,
      tone: formTone,
      jobDescription: formJobDesc,
      resumeText: formResume,
      generatedContent: formContent,
    };

    try {
      if (isEditing) {
        const res = await fetch(`/api/cover-letters/${formId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setCoverLetters((prev) =>
            prev.map((item) => (item._id === formId ? data.data : item))
          );
          setSelectedLetter(data.data);
          setIsFormOpen(false);
        } else {
          alert(data.error || "Failed to update cover letter");
        }
      } else {
        const res = await fetch("/api/cover-letters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setCoverLetters((prev) => [data.data, ...prev]);
          setSelectedLetter(data.data);
          setIsFormOpen(false);
        } else {
          alert(data.error || "Failed to save cover letter");
        }
      }
    } catch (err) {
      alert("An error occurred while saving the cover letter");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>🤖 Cover Letter AI</h2>
          <button className={styles.createButton} onClick={handleOpenCreate}>
            + New Letter
          </button>
        </div>

        <div className={styles.letterList}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.skeleton}></div>
              <div className={styles.skeleton}></div>
              <div className={styles.skeleton}></div>
            </div>
          ) : coverLetters.length === 0 ? (
            <p className={styles.emptyText}>No cover letters created yet.</p>
          ) : (
            coverLetters.map((letter) => (
              <div
                key={letter._id}
                className={`${styles.letterItem} ${
                  selectedLetter?._id === letter._id ? styles.selectedItem : ""
                }`}
                onClick={() => setSelectedLetter(letter)}
              >
                <h4>{letter.title}</h4>
                <p>
                  {letter.jobTitle} at {letter.company}
                </p>
                <span className={styles.toneBadge}>{letter.tone || "Professional"}</span>
              </div>
            ))
          )}
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
          <button className={styles.logoutButton} onClick={logout}>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className={styles.workspace}>
        {isFormOpen ? (
          <div className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h2>{isEditing ? "Edit Cover Letter" : "Create New Cover Letter"}</h2>
              <button
                className={styles.closeButton}
                onClick={() => setIsFormOpen(false)}
                disabled={actionLoading}
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.editorForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="formTitle">Document Title *</label>
                  <input
                    id="formTitle"
                    type="text"
                    placeholder="e.g. Google - Software Engineer"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="formTone">Tone of Voice</label>
                  <select
                    id="formTone"
                    value={formTone}
                    onChange={(e) => setFormTone(e.target.value)}
                  >
                    <option value="Professional">Professional</option>
                    <option value="Enthusiastic">Enthusiastic</option>
                    <option value="Concise">Concise</option>
                    <option value="Confident">Confident</option>
                  </select>
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="formJobTitle">Target Job Title *</label>
                  <input
                    id="formJobTitle"
                    type="text"
                    placeholder="e.g. Frontend Engineer"
                    value={formJobTitle}
                    onChange={(e) => setFormJobTitle(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="formCompany">Company Name *</label>
                  <input
                    id="formCompany"
                    type="text"
                    placeholder="e.g. Google"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="formJobDesc">Job Description (optional)</label>
                <textarea
                  id="formJobDesc"
                  placeholder="Paste details to adjust keywords..."
                  value={formJobDesc}
                  onChange={(e) => setFormJobDesc(e.target.value)}
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="formResume">Your Resume Content (optional)</label>
                <textarea
                  id="formResume"
                  placeholder="Paste your achievements..."
                  value={formResume}
                  onChange={(e) => setFormResume(e.target.value)}
                  rows={3}
                />
              </div>

              <div className={styles.generationToolbar}>
                <button
                  type="button"
                  className={styles.generateBtn}
                  onClick={handleAutoGenerate}
                >
                  ⚡ Auto-Generate Cover Letter
                </button>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="formContent">Generated Cover Letter *</label>
                <textarea
                  id="formContent"
                  placeholder="The generated cover letter will appear here. You can also edit it directly..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  rows={12}
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.saveButton}
                disabled={actionLoading}
              >
                {actionLoading ? "Saving..." : isEditing ? "Save Changes" : "Save Cover Letter"}
              </button>
            </form>
          </div>
        ) : selectedLetter ? (
          <div className={styles.detailContainer}>
            <div className={styles.detailHeader}>
              <div className={styles.detailTitleInfo}>
                <h2>{selectedLetter.title}</h2>
                <p>
                  {selectedLetter.jobTitle} at <strong>{selectedLetter.company}</strong>
                </p>
                <div className={styles.detailMeta}>
                  <span className={styles.toneBadge}>{selectedLetter.tone || "Professional"}</span>
                  <span className={styles.dateLabel}>
                    Updated {new Date(selectedLetter.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className={styles.detailActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleOpenEdit(selectedLetter)}
                  disabled={actionLoading}
                >
                  📝 Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(selectedLetter._id)}
                  disabled={actionLoading}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            <div className={styles.previewPanel}>
              <pre className={styles.letterPreview}>{selectedLetter.generatedContent}</pre>
            </div>
          </div>
        ) : (
          <div className={styles.emptyWorkspace}>
            <div className={styles.emptyWorkspaceIcon}>📝</div>
            <h2>No Cover Letter Selected</h2>
            <p>Select an existing cover letter from the sidebar or create a new one to begin.</p>
            <button className={styles.largeCreateButton} onClick={handleOpenCreate}>
              Create New Cover Letter
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
