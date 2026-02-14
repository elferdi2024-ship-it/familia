"use client"

import { useState, useRef } from "react"
import { storage } from "@/lib/firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { useAuth } from "@/contexts/AuthContext"

interface ImageUploaderProps {
    images: string[]
    onImagesChange: (urls: string[]) => void
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
    const { user } = useAuth()
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0 || !user) return

        setUploading(true)
        const newUrls: string[] = [...images]

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            // Limit to 10MB
            if (file.size > 10 * 1024 * 1024) {
                alert(`El archivo ${file.name} supera los 10MB`)
                continue
            }

            const storageRef = ref(storage, `properties/${user.uid}/${Date.now()}-${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file)

            await new Promise<void>((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                        setProgress(prog)
                    },
                    (error) => {
                        console.error("Upload failed", error)
                        reject(error)
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                        newUrls.push(downloadURL)
                        resolve()
                    }
                )
            })
        }

        onImagesChange(newUrls)
        setUploading(false)
        setProgress(0)
    }

    const removeImage = (index: number) => {
        const newUrls = images.filter((_, i) => i !== index)
        onImagesChange(newUrls)
    }

    return (
        <div className="space-y-6">
            <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center bg-white/50 dark:bg-slate-900/50 transition-all cursor-pointer group ${uploading ? "border-primary bg-primary/5" : "border-slate-300 dark:border-slate-700 hover:border-primary"
                    }`}
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={uploading}
                />

                {uploading ? (
                    <div className="space-y-4">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                        <p className="text-primary font-bold">Subiendo imágenes... {progress}%</p>
                    </div>
                ) : (
                    <>
                        <span className="material-icons text-slate-400 dark:text-slate-600 text-5xl mb-3 group-hover:text-primary transition-colors">cloud_upload</span>
                        <p className="text-slate-700 dark:text-slate-300 font-medium">Arrastre las imágenes aquí o haga clic para subir</p>
                        <p className="text-xs text-slate-500 mt-2">Mínimo 5 fotos sugeridas. Máximo 10MB por archivo.</p>
                    </>
                )}
            </div>

            {/* Image Grid Preview */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {images.map((url, index) => (
                        <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 group">
                            <img alt={`Propiedad ${index}`} className="w-full h-full object-cover" src={url} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => removeImage(index)}
                                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                    type="button"
                                >
                                    <span className="material-icons text-sm">delete</span>
                                </button>
                            </div>
                            {index === 0 && (
                                <span className="absolute top-2 left-2 bg-primary text-[10px] font-bold text-white px-2 py-0.5 rounded uppercase">Principal</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
