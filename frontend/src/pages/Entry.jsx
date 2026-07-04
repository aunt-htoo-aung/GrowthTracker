import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useEntries } from "../context/EntryContext";
import Navbar from "../components/Navbar";
import { Button, Box } from "../components/UIElements";
import {
  Lightbulb,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  List,
  ListOrdered,
  X,
  Plus,
  ChevronRight,
  Search,
} from "lucide-react";

function ToolbarBtn({ active, children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`p-2 rounded-md transition ${
        active
          ? "bg-blue-100 text-blue-700 shadow-sm"
          : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

export default function AddEntry() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const { addEntry, updateEntry, getEntryById, allTags } = useEntries();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [tagQuery, setTagQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ── Load entry data when editing ── */
  useEffect(() => {
    if (isEditing && id) {
      const entry = getEntryById(id);
      if (entry) {
        setTitle(entry.title || "");
        setDate(entry.date || new Date().toISOString().split("T")[0]);
        setDescription(entry.description || "");
        setSelectedTags(entry.tags || []);
      }
    }
  }, [id, isEditing, getEntryById]);

  /* ── Active formatting state tracking ── */
  const [active, setActive] = useState({});

  const updateActiveState = useCallback(() => {
    setActive({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      justifyFull: document.queryCommandState("justifyFull"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
    });
  }, []);

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveState);
    return () => document.removeEventListener("selectionchange", updateActiveState);
  }, [updateActiveState]);

  /* ── Rich text editor helpers ── */
  const exec = useCallback((command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    // sync HTML to state
    if (editorRef.current) {
      setDescription(editorRef.current.innerHTML);
    }
    // update active state after command
    setTimeout(updateActiveState, 0);
  }, [updateActiveState]);

  const handleBold = () => exec("bold");
  const handleItalic = () => exec("italic");
  const handleUnderline = () => exec("underline");
  const handleStrikethrough = () => exec("strikeThrough");
  const handleBulletList = () => exec("insertUnorderedList");
  const handleOrderedList = () => exec("insertOrderedList");
  const handleAlignLeft = () => exec("justifyLeft");
  const handleAlignCenter = () => exec("justifyCenter");
  const handleAlignRight = () => exec("justifyRight");
  const handleAlignJustify = () => exec("justifyFull");

  const handleLink = () => {
    const url = window.prompt("Enter URL:", "https://");
    if (url) exec("createLink", url);
  };

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      setDescription(editorRef.current.innerHTML);
    }
    updateActiveState();
  }, [updateActiveState]);

  // sync HTML on mount (if description was pre-filled for editing)
  useEffect(() => {
    if (editorRef.current && description && editorRef.current.innerHTML !== description) {
      editorRef.current.innerHTML = description;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        if (e.key === "b") { e.preventDefault(); handleBold(); }
        if (e.key === "i") { e.preventDefault(); handleItalic(); }
        if (e.key === "u") { e.preventDefault(); handleUnderline(); }
      }
    },
    [handleBold, handleItalic, handleUnderline]
  );

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags([...selectedTags, trimmed]);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleCustomTag = (e) => {
    e.preventDefault();
    addTag(customTag);
    setCustomTag("");
    setTagQuery("");
  };

  /* ── Tag autocomplete ── */
  const filteredSuggestions = allTags.filter(
    (tag) =>
      tag.toLowerCase().includes(tagQuery.toLowerCase()) &&
      !selectedTags.includes(tag)
  );

  const handleTagInput = (e) => {
    const val = e.target.value;
    setCustomTag(val);
    setTagQuery(val);
    setShowSuggestions(val.trim().length > 0);
  };

  const selectSuggestion = (tag) => {
    addTag(tag);
    setCustomTag("");
    setTagQuery("");
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, date, description, tags: selectedTags };
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateEntry(Number(id), data);
      } else {
        await addEntry(data);
      }
      navigate("/");
    } catch (err) {
      alert(`Failed to ${isEditing ? "update" : "save"} entry. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const isEditorEmpty =
    !description ||
    description === "<br>" ||
    description.trim() === "";
  const isFormValid =
    title.trim() && date && !isEditorEmpty && selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-4 sm:mb-6">
          <Link to="/" className="text-blue-600 hover:underline">Dashboard</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-500">{isEditing ? "Edit Entry" : "Add New Entry"}</span>
        </nav>

        <form onSubmit={handleSubmit}>
          <Box className="space-y-5 sm:space-y-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              {isEditing ? "Edit Entry" : "Add New Entry"}
            </h1>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 sm:p-4 flex gap-3 items-start">
              <div className="bg-blue-500 p-1.5 rounded-full text-white shrink-0">
                <Lightbulb size={16} />
              </div>
              <p className="text-sm text-blue-800">
                {isEditing
                  ? "Update your progress entry. Changes will be saved immediately."
                  : "Log what you've learned or worked on today. It will be added to your progress tracker."}
              </p>
            </div>

            {/* Date */}
            <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-1 sm:gap-4 sm:items-center">
              <label className="text-sm font-semibold text-slate-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full sm:max-w-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
              />
            </div>

            {/* Title */}
            <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-1 sm:gap-4 sm:items-center">
              <label className="text-sm font-semibold text-slate-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g. Built REST API with Spring Boot"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
              />
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-1 sm:gap-4">
              <label className="text-sm font-semibold text-slate-700 sm:mt-2">Description</label>
              <div>
                <div className="border border-slate-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition">
                  {/* Toolbar */}
                  <div className="bg-white border-b border-slate-100 px-2 py-1.5 flex flex-wrap gap-0.5">
                    <ToolbarBtn active={active.bold} onMouseDown={(e) => e.preventDefault()} onClick={handleBold} title="Bold (Ctrl+B)"><Bold size={16} /></ToolbarBtn>
                    <ToolbarBtn active={active.italic} onMouseDown={(e) => e.preventDefault()} onClick={handleItalic} title="Italic (Ctrl+I)"><Italic size={16} /></ToolbarBtn>
                    <div className="w-px bg-slate-200 mx-1 self-stretch" />
                    <ToolbarBtn active={active.justifyLeft} onMouseDown={(e) => e.preventDefault()} onClick={handleAlignLeft} title="Align left"><AlignLeft size={16} /></ToolbarBtn>
                    <ToolbarBtn active={active.justifyCenter} onMouseDown={(e) => e.preventDefault()} onClick={handleAlignCenter} title="Align center"><AlignCenter size={16} /></ToolbarBtn>
                    <ToolbarBtn active={active.justifyRight} onMouseDown={(e) => e.preventDefault()} onClick={handleAlignRight} title="Align right"><AlignRight size={16} /></ToolbarBtn>
                    <ToolbarBtn active={active.justifyFull} onMouseDown={(e) => e.preventDefault()} onClick={handleAlignJustify} title="Justify"><AlignJustify size={16} /></ToolbarBtn>
                    <div className="w-px bg-slate-200 mx-1 self-stretch" />
                    <ToolbarBtn onMouseDown={(e) => e.preventDefault()} onClick={handleLink} title="Insert Link"><Link2 size={16} /></ToolbarBtn>
                    <div className="w-px bg-slate-200 mx-1 self-stretch" />
                    <ToolbarBtn active={active.insertUnorderedList} onMouseDown={(e) => e.preventDefault()} onClick={handleBulletList} title="Bullet list"><List size={16} /></ToolbarBtn>
                    <ToolbarBtn active={active.insertOrderedList} onMouseDown={(e) => e.preventDefault()} onClick={handleOrderedList} title="Numbered list"><ListOrdered size={16} /></ToolbarBtn>
                  </div>
                  {/* Rich text editor */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleEditorInput}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-50 p-3 sm:p-4 min-h-[7rem] sm:min-h-[8.5rem] focus:outline-none text-sm text-slate-700 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline [&_p]:my-1"
                    data-placeholder="Describe what you learned or worked on..."
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">Rich text formatting — bold, italic, links, and lists</p>
              </div>
            </div>

            {/* Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-1 sm:gap-4">
              <label className="text-sm font-semibold text-slate-700 sm:mt-2">Tags</label>
              <div className="space-y-3">
                {/* Selected tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-900 transition">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Custom tag input with autocomplete */}
                <div className="relative">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={customTag}
                        onChange={handleTagInput}
                        onFocus={() => tagQuery.trim() && setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        onKeyDown={(e) => e.key === "Enter" && handleCustomTag(e)}
                        placeholder="Type to search or add a tag..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition"
                      />
                      {/* Autocomplete dropdown */}
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {filteredSuggestions.slice(0, 8).map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => selectSuggestion(tag)}
                              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition first:rounded-t-lg last:rounded-b-lg"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={handleCustomTag}
                      variant="secondary"
                      className="shrink-0"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                {/* Suggested tags (from context) */}
                {allTags.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-2 font-medium">Suggested tags</p>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 12).map((tag) => {
                        const selected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => (selected ? removeTag(tag) : addTag(tag))}
                            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
                              selected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Box>

          {/* Footer Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-4">
            <Link to="/">
              <Button variant="secondary" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!isFormValid || submitting}
              className={`w-full sm:w-auto ${(!isFormValid || submitting) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {submitting
                ? (isEditing ? "Saving..." : "Adding...")
                : (isEditing ? "Save Changes" : "Add Entry")}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
