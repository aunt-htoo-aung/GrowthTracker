import React, { useState } from "react";
import {
  Lightbulb,
  Bold,
  Italic,
  AlignLeft,
  Link,
  List,
  ListOrdered,
  X,
} from "lucide-react";

const AddEntry = () => {
  const [selectedTags, setSelectedTags] = useState(["JSON"]);
  const popularTags = [
    "Java",
    "Spring Boot",
    "API",
    "MySQL",
    "Docker",
    "C",
    "React",
    "Python",
    "Node.js",
  ];

  return (
    <div className="min-h-screen bg-[#f0f4f8] p-4 md:p-8 font-sans text-slate-700">
      {/* Breadcrumb Navigation */}
      <nav className="max-w-4xl mx-auto mb-6 text-sm flex gap-2">
        <span className="text-blue-600 cursor-pointer hover:underline">
          Dashboard
        </span>
        <span className="text-slate-400">/</span>
        <span className="text-slate-500">Add New Entry</span>
      </nav>

      {/* Main Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-[#2d3e50] mb-6">
            Add New Entry
          </h1>

          {/* Info Banner */}
          <div className="bg-[#eef4ff] border border-blue-100 rounded-lg p-4 mb-8 flex gap-3 items-center">
            <div className="bg-blue-500 p-1.5 rounded-full text-white">
              <Lightbulb size={18} />
            </div>
            <p className="text-[#4a5568] text-sm font-medium">
              Log what you've learned or worked on today. It will be added to
              your progress tracker.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <label className="w-24 font-bold text-slate-700">Date:</label>
              <span className="text-slate-600">April 24, 2024</span>
            </div>

            <div className="flex items-center gap-4">
              <label className="w-24 font-bold text-slate-700">Title:</label>
              <input
                type="text"
                placeholder="E.g. Built REST API with Spring Boot"
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-slate-700">Description:</label>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <textarea
                  placeholder="Describe what you learned or worked on. Markdown is supported."
                  className="w-full bg-slate-50 p-4 h-32 focus:outline-none resize-none text-slate-600"
                />
                {/* Text Editor Toolbar */}
                <div className="bg-white border-t border-slate-200 p-2 flex gap-4 text-slate-400">
                  <Bold
                    size={18}
                    className="cursor-pointer hover:text-slate-600"
                  />
                  <Italic
                    size={18}
                    className="cursor-pointer hover:text-slate-600"
                  />
                  <AlignLeft
                    size={18}
                    className="cursor-pointer hover:text-slate-600"
                  />
                  <Link
                    size={18}
                    className="cursor-pointer hover:text-slate-600 rotate-45"
                  />
                  <List
                    size={18}
                    className="cursor-pointer hover:text-slate-600"
                  />
                  <ListOrdered
                    size={18}
                    className="cursor-pointer hover:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <label className="w-24 font-bold text-slate-700">Tags:</label>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 flex flex-wrap gap-2 min-h-[42px]">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white border border-slate-200 px-2 py-0.5 rounded text-sm flex items-center gap-1"
                    >
                      {tag}{" "}
                      <X size={14} className="text-slate-400 cursor-pointer" />
                    </span>
                  ))}
                </div>
              </div>

              <div className="ml-28">
                <p className="text-xs text-slate-400 mb-3 font-medium">
                  Popular tags: Java, joce bbod API, MySQL Docker C, Rmcre...
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                        tag === "Java" || tag === "React"
                          ? "bg-[#4a6ea9] text-white"
                          : tag === "MySQL" || tag === "Docker"
                            ? "bg-[#e8f3f0] text-[#4a7c6d]"
                            : "bg-[#f0f4f8] text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-8 py-4 flex justify-between border-t border-slate-100">
          <button className="bg-white border border-slate-200 px-6 py-2 rounded-lg font-bold text-blue-600 hover:bg-slate-100 transition">
            Cancel
          </button>
          <div className="flex gap-3">
            <button className="bg-white border border-slate-200 px-6 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 transition">
              Cancel
            </button>
            <button className="bg-[#4a6ea9] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#3b598a] transition shadow-md shadow-blue-900/10">
              Add Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEntry;
