import React from 'react';

const Modal = (props) => {

    const prevSlide = () => {
        let index = document.querySelector('.artwork-gallery .active').getAttribute('id')
        index = Number(index.replace('artwork-', ''))
        let lastIndex = document.querySelector('.artwork-gallery').childElementCount - 1
        document.querySelector('.artwork-gallery .active').classList.remove('active')

        if(index === 0) {
            document.querySelector('.artwork-gallery #artwork-' + lastIndex.toString()).classList.add('active')
        } else {
            document.querySelector('.artwork-gallery #artwork-' + (index - 1)).classList.add('active')
        }
    }

    const nextSlide = () => {
        let index = document.querySelector('.artwork-gallery .active').getAttribute('id')
        index = Number(index.replace('artwork-', ''))
        let lastIndex = document.querySelector('.artwork-gallery').childElementCount - 1
        document.querySelector('.artwork-gallery .active').classList.remove('active')

        if(index === lastIndex) {
            document.querySelector('.artwork-gallery #artwork-0').classList.add('active')
        } else {
            document.querySelector('.artwork-gallery #artwork-' + (index + 1)).classList.add('active')
        }
    }

    return (
        <div className="modal" style={{display: props.showModal === true ? "block" : "none"}}>
            <div className="modal-content">
                <div className="modal-header">
                <h3>Inside the Collection: {props.departmentName}</h3>
                    <span className="close" onClick={() => props.setShowModal(false)}>
                        &times;
                    </span>
                </div>
                {props.isModalLoading ? ( // Check if loading state is true
                    <div className="loading-screen">
                        <div className="loading-wheel"></div>
                    </div>
                    ) : (
                        <div className="modal-body">
                            <div className="left-arrow" key="left-arrow" onClick={prevSlide}>
                                <img width="25" height="25" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/25/external-left-chevron-arrows-inkubators-detailed-outline-inkubators-2.png" alt="external-left-chevron-arrows-inkubators-detailed-outline-inkubators-2"/>
                            </div>
                            <div className="artwork-gallery">
                                {props.departmentDetails && props.departmentDetails.map((detail, index) => (
                                    <div className="artwork-listing" key={index} id={`artwork-${index}`}>
                                        <div className="upper">
                                            <h4 className="title"><b>{detail.title}</b></h4>
                                            {detail.culture !== '' && detail.objectDate !== '' ? (
                                                <span><em>{detail.culture}, {detail.objectDate}</em></span>
                                            ) : detail.culture !== '' ? (
                                                <span><em>{detail.culture}</em></span>
                                            ) : detail.objectDate !== '' ? (
                                                <span><em>{detail.objectDate}</em></span>
                                            ) : null}
                                            <br></br>
                                            <a href={detail.objectURL} target="_blank" rel="noopener noreferrer" className="view-online">
                                                    View on Met Museum Website
                                            </a>
                                        </div>
                                        <div className="lower">
                                            <div className="image">
                                                <img src={detail.primaryImageSmall} alt={detail.title} width='200' height='200' />
                                            </div>
                                            <div className="description">
                                                <h4><b><em>AI Summary of Artwork Metadata</em></b></h4>
                                                <p className="artwork-summary">{detail.summary}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="right-arrow" key="right-arrow" onClick={nextSlide}>
                                <img width="25" height="25" src="https://img.icons8.com/external-inkubators-detailed-outline-inkubators/25/external-right-chevron-arrows-inkubators-detailed-outline-inkubators-2.png" alt="external-right-chevron-arrows-inkubators-detailed-outline-inkubators-2"/>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default Modal;