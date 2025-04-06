import React, { useRef, useState, useEffect } from 'react';
import { useDispatchCart, useCart } from './ContextReducer';

export default function Card(props) {
    const dispatch = useDispatchCart();
    const data = useCart();
    const priceRef = useRef();
    const options = props.options;
    const priceOptions = Object.keys(options);

    const [qty, setQty] = useState(1);
    const [size, setSize] = useState(priceOptions[0] || ""); // Default to first available size

    // Ensure price updates when size or qty changes
    useEffect(() => {
        if (!size || !priceOptions.includes(size)) {
            setSize(priceOptions[0]); // Update size only if invalid
        }
    }, [priceOptions, size]);

    const finalPrice = qty * (parseInt(options[size]) || 0); // Ensure price updates dynamically

    const handleAddToCart = async () => {
        const food = data.find(item => item._id === props.foodItem._id && item.size === size);
        
        if (food) {
            await dispatch({
                type: "UPDATE", 
                id: props.foodItem._id, 
                price: finalPrice, 
                qty: qty
            });
        } else {
            await dispatch({
                type: "ADD",
                id: props.foodItem._id,
                name: props.foodItem.name,
                price: finalPrice,
                qty: qty,
                size: size,
                img: props.foodItem.img
            });
        }
    };

    return (
        <div> 
            <div className="card mt-3" style={{ width: "18rem", maxHeight: "360px"}}>
                <img style={{ height: "120px", objectFit: "fill" }}
                    src={props.foodItem.img}
                    className="card-img-top"
                    alt="..."
                />
                <div className="card-body">
                    <h5 className="card-title">{props.foodItem.name}</h5>
                    <div className='container w-100'>
                        {/* Quantity Selector */}
                        <select className='m-2 h-100 bg-success' onChange={(e) => setQty(parseInt(e.target.value))} value={qty}>
                            {Array.from(Array(6), (e, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>

                        {/* Size Selector */}
                        <select className='m-2 h-100 bg-success rounded' ref={priceRef} onChange={(e) => setSize(e.target.value)} value={size}>
                            {priceOptions.map((data) => (
                                <option key={data} value={data}>{data}</option>
                            ))}
                        </select>

                        {/* Price Display */}
                        <div className='d-inline h-100 fs-5'>
                            Rs.{finalPrice}/-
                        </div>
                        <hr />

                        {/* Add to Cart Button */}
                        <button className='btn btn-success justify-center ms-2' onClick={handleAddToCart}>Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
