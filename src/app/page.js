"use client"

import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal'
import Department from './Department'

export default function Home() {
    const [gallery, setGallery] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [departmentName, setDepartmentName] = useState('Met Museum')
    const [departmentDetails, setDepartmentDetails] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isModalLoading, setIsModalLoading] = useState(true)

    const handleDepartmentClick = async (departmentId, departmentName) => {
        try {
            setShowModal(true)
            setIsModalLoading(true)
            setDepartmentName(departmentName)
            const departmentDetailResponse = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&departmentId=' + departmentId + '&hasImages=true&q=*')
            if(!departmentDetailResponse.ok) {
                throw new Error('Network response was not ok')
            }
            const departmentDetailData = await departmentDetailResponse.json()
            const selectedObjects = departmentDetailData.objectIDs.slice(0,10)
        
            const promises = selectedObjects.map(async(objectID) => {
                const objectResponse = await fetch('https://collectionapi.metmuseum.org/public/collection/v1/objects/' + objectID.toString())

                if(!objectResponse.ok) {
                    throw new Error('Network response was not ok')
                }

                const objectData = await objectResponse.json()

                return objectData
            })

            const results = await Promise.all(promises)
            const resultsWithImage = results.filter(result => result.primaryImageSmall !== '')
            setDepartmentDetails(resultsWithImage)
            setIsModalLoading(false)

            window.setTimeout(function(){
                let firstListing = document.querySelector('.artwork-listing:first-of-type')
                firstListing.classList.add('active')
            }, 200)
        } catch (error) {
            console.error('Error fetching data:', error)
            setIsModalLoading(false)
        } finally {
            console.log('Completed')
            setIsModalLoading(false)
        }
    }

    useEffect(() => {
        setIsLoading(true)
        const fetchDepartments = async () => {
            try {
                const selectedDepartments = [{
                    departmentId: 3,
                    displayName: 'Ancient Near Eastern Art'
                }, {
                    departmentId: 4,
                    displayName: 'Arms and Armor'
                }, { 
                    departmentId: 6,
                    displayName: 'Asian Art'
                }, {
                    departmentId: 9,
                    displayName: 'Drawings and Prints'
                }, {
                    departmentId: 10,
                    displayName: 'Egyptian Art'
                }, {
                    departmentId: 11,
                    displayName: 'European Paintings'
                }, {
                    departmentId: 13,
                    displayName: 'Greek and Roman Art'
                }, {
                    departmentId: 14,
                    displayName: 'Islamic Art'
                },
                {
                    departmentId: 17,
                    displayName: 'Medieval Art'
                }]

                const results = []
                for (const department of selectedDepartments) {
                    const departmentId = department.departmentId.toString()
                    const displayName = department.displayName

                    const highlightedResponse = await fetch(
                        'https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&departmentId=' + departmentId + '&hasImages=true&q=*'
                    )
                    if(!highlightedResponse.ok) {
                        throw new Error('Network response was not ok')
                    }
                    const highlightedData = await highlightedResponse.json()
                    const objectResponse = await fetch(
                        'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + highlightedData.objectIDs[0].toString()
                    )
                    if(!objectResponse.ok) {
                        throw new Error('Network response was not ok')
                    }
                    const objectData = await objectResponse.json()
                    let primaryImage = objectData.primaryImageSmall

                    if(!objectData.primaryImageSmall){
                        primaryImage = '/MetMuseum.webp'
                    }

                    results.push({
                        departmentId: departmentId,
                        displayName: displayName,
                        primaryImage: primaryImage,
                        title: objectData.title
                    }) 
                }

                setGallery(results)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error)
                setIsLoading(false)
            }
        }

        fetchDepartments();
    }, [])

    return (
        <div className="gallery">
            {isLoading ? ( // Check if loading state is true
                <div className="loading-screen">
                    <div className="loading-wheel"></div>
                    <p className="loading">Loading<span>...</span></p> 
                </div>
            ) : (
                <>
                    {gallery.map((data,index) => {
                        return <Department key={index} data={data} handleDepartmentClick={handleDepartmentClick}/>
                    })}
                    <Modal showModal={showModal} setShowModal={setShowModal} departmentName={departmentName} departmentDetails={departmentDetails} isModalLoading={isModalLoading}/>
                </>
            )}
        </div>
    );
}
