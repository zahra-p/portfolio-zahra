import Link from 'next/link';
export default function ProjectCard({title, description, demo, github}: any){
  return (
    <article className="bg-white dark:bg-gray-800 shadow rounded-lg p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
      <div className="mt-4 flex gap-3">
        {demo && <a href={demo} target="_blank" rel="noreferrer" className="text-indigo-600 underline">Live Demo</a>}
        {github && <a href={github} target="_blank" rel="noreferrer" className="text-gray-600 underline">Source</a>}
      </div>
    </article>
  )
}
