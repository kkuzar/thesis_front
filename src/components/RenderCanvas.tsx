import {Suspense, useDeferredValue, useEffect, useState} from 'react'
import {Canvas} from '@react-three/fiber';
import {OrbitControls, useGLTF} from '@react-three/drei'
import tunnel from 'tunnel-rat'
import {getBlob, getStorage, ref} from "firebase/storage";

const status = tunnel()

// @ts-ignore
function Model({url, ...props}) {
    const deferred = useDeferredValue(url)
    // @ts-ignore
    const {scene} = useGLTF(deferred)
    // <primitive object={...} mounts an already existing object
    return <primitive object={scene} {...props} />
}


// @ts-ignore
const RenderCanvas = ({url, ...props}) => {

    const [obj, setObj] = useState(null);

    const [glbBlob, setGlbBlob] = useState(null)

    const downloadZip = async (storageURL: String) => {
        const storage = getStorage();
        // @ts-ignore
        const glbRef = ref(storage, storageURL);
        const glbBlob = await getBlob(glbRef);
        const blobUrl = URL.createObjectURL(glbBlob);
        // @ts-ignore
        setGlbBlob(blobUrl)
    };


    useEffect(() => {
        async function loadModel(zipUrl: String) {
            try {
                // @ts-ignore
                downloadZip(zipUrl)
            } catch (error) {
                console.error("Failed to load model:", error);
                // loadDefaultModel();
            }
        }

        if (url != "") {
            loadModel(url)
        }
        console.log(url);
    }, [url]);


    return (

        <Canvas camera={{position: [-10, 10, 40], fov: 50}}>
            <spotLight position={[50, 50, 10]} angle={0.15} penumbra={2}/>
            <ambientLight intensity={2.0}/>
            {/*<pointLight position={[10, 10, 10]} />*/}
            <group position={[0, 0, 0]}>
                <Suspense fallback={<status.In>Loading ...</status.In>}>

                    {/*// @ts-ignore*/}
                    {glbBlob ? <Model position={[0, 0, 0]} rotation={[-45, -0 ,30]} url={glbBlob} {...props}/> : <Model position={[0, -7, 0]} url={"https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/tree-beech/model.gltf"} />}
                </Suspense>
                {/*<ContactShadows scale={20} blur={10} far={20} />*/}
            </group>
            <OrbitControls/>
        </Canvas>

    )
}
export default RenderCanvas
