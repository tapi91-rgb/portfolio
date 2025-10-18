import Link from 'next/link';

export default function CvPage() {
  const path = '/cv/Farid_Masood_CV.pdf'; // place PDF at public/cv/Farid_Masood_CV.pdf
  return (
    <div className="mx-auto w-[min(1200px,92vw)] py-10">
      <h2 className="text-2xl font-bold mb-2">CV</h2>
      <div className="panel p-3">
        <object data={path} type="application/pdf" className="w-full h-[70vh]">
          <p>PDF not found. Please place your CV at <code>public/cv/Farid_Masood_CV.pdf</code>.</p>
        </object>
        <div className="mt-3">
          <Link href={path} className="btn btn-primary">Download</Link>
        </div>
      </div>
    </div>
  );
}