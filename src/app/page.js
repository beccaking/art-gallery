"use client"

import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';


// ...

const Modal = ({ showModal, setShowModal, isModalLoading, departmentName, departmentDetails }) => {
    const leftArrow = React.useRef(null)
    const rightArrow = React.useRef(null)
    const artworkGallery = useRef(null)

    useEffect(() => {
        console.log(departmentDetails)
        if(!departmentDetails) {
            return
        }

        leftArrow.current.addEventListener('click', function(){
            console.log('left clicked')
            let index = document.querySelector('.artwork-gallery .active').getAttribute('id')
            index = Number(index.replace('artwork-', ''))
            document.querySelector('.artwork-gallery .active').classList.remove('active')

            if(index === 0) {
                document.querySelector('.artwork-gallery #artwork-9').classList.add('active')
            } else {
                document.querySelector('.artwork-gallery #artwork-' + (index - 1).toString()).classList.add('active')
            }
        })

        rightArrow.current.addEventListener('click', function(){
            console.log('right clicked')
            let index = document.querySelector('.artwork-gallery .active').getAttribute('id')
            index = Number(index.replace('artwork-', ''))
            document.querySelector('.artwork-gallery .active').classList.remove('active')

            if(index === document.querySelector('.artwork-gallery').childElementCount - 1) {
                document.querySelector('.artwork-gallery #artwork-0').classList.add('active')
            } else {
                document.querySelector('.artwork-gallery #artwork-' + (index + 1)).classList.add('active')
            }
        })

        return () => {
            leftArrow.current.removeEventListener('click', () => {})
            rightArrow.current.removeEventListener('click', () => {})
        }
    }, [departmentDetails])

    return (
        <div className="modal" style={{display: showModal === true ? "block" : "none"}}>
            <div className="modal-content">
                <div className="modal-header">
                <h3>Inside the Collection: {departmentName}</h3>
                    <span className="close" onClick={() => setShowModal(false)}>
                        &times;
                    </span>
                </div>
                {isModalLoading ? ( // Check if loading state is true
                    <div className="loading-screen">
                        <div className="loading-wheel"></div>
                    </div>
                    ) : (
                        <div className="modal-body">
                            <div className="left-arrow" key="left-arrow" ref={leftArrow}>
                                <img width="25" height="25" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/25/external-left-chevron-arrows-inkubators-detailed-outline-inkubators-2.png" alt="external-left-chevron-arrows-inkubators-detailed-outline-inkubators-2"/>
                            </div>
                            <div className="artwork-gallery">
                                {departmentDetails && departmentDetails.map((detail, index) => (
                                    <div className="artwork-listing" key={index} id={`artwork-${index}`}>
                                        <h4>{detail.title}</h4>
                                        {detail.culture !== '' && detail.objectDate !== '' ? (
                                            <span>{detail.culture}, {detail.objectDate}</span>
                                        ) : detail.culture !== '' ? (
                                            <span>{detail.culture}</span>
                                        ) : detail.objectDate !== '' ? (
                                            <span>{detail.objectDate}</span>
                                        ) : null}
                                        
                                        <br></br>
                                        <a href={detail.objectURL} target="_blank" rel="noopener noreferrer">
                                            <em>View on Met Museum Website</em>
                                        </a>
                                        <img src={detail.primaryImageSmall} alt={detail.title} width='200' height='200' />
                                        <p>{detail.summary}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="right-arrow" key="right-arrow" ref={rightArrow}>
                                <img width="25" height="25" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/25/external-right-chevron-arrows-inkubators-detailed-outline-inkubators-2.png" alt="external-right-chevron-arrows-inkubators-detailed-outline-inkubators-2"/>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

const Department = ({data, handleDepartmentClick}) => {
    return (
        <div className="department-listing" id={data.departmentId} onClick={() => handleDepartmentClick(data.departmentId, data.displayName)}>
            <img src={data.primaryImage} alt={data.title} width='200' height='200' />
            <h2>{data.displayName}</h2>
        </div>
    )
}

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
