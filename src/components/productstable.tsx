import React from 'react';

const ProductsTable: React.FC = () => {
    return (
        <div className="overflow-x-auto">
        <table className="table">
            {/* head */}
            <thead>
            <tr>
                <th>#</th>
                <th>Product</th>
                <th>Description</th>
                <th>Reddit Reviews</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                {/* row 1 */}
                <tr>
                    <th>1</th>
                    <td>
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                            <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component" />
                        </div>
                        </div>
                        <div>
                        <div className="font-bold">Product Name</div>
                        </div>
                    </div>
                    </td>
                    <td>
                    <span className="text-sm"> Description</span>
                    <br />
                    </td>
                    <td><span className="text-xs opacity-500">r/MakeupAddictionUK ...................................................</span></td>
                    <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                </tr>
                {/* row 2 */}
                <tr>
                    <th>2</th>
                    <td>
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                            <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component" />
                        </div>
                        </div>
                        <div>
                        <div className="font-bold">Product Name</div>
                        </div>
                    </div>
                    </td>
                    <td>
                    <span className="text-sm"> Description</span>
                    <br />
                    </td>
                    <td><span className="text-xs opacity-500">r/MakeupAddictionUK ....</span></td>
                    <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                </tr>
                {/* row 3 */}
                <tr>
                    <th>3</th>
                    <td>
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                            <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component" />
                        </div>
                        </div>
                        <div>
                        <div className="font-bold">Product Name</div>
                        </div>
                    </div>
                    </td>
                    <td>
                    <span className="text-sm"> Description</span>
                    <br />
                    </td>
                    <td><span className="text-xs opacity-500">r/MakeupAddictionUK ....</span></td>
                    <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                </tr>
                {/* row 4 */}
                <tr>
                    <th>4</th>
                    <td>
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                            <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component" />
                        </div>
                        </div>
                        <div>
                        <div className="font-bold">Product Name</div>
                        </div>
                    </div>
                    </td>
                    <td>
                    <span className="text-sm"> Description</span>
                    <br />
                    </td>
                    <td><span className="text-xs opacity-500">r/MakeupAddictionUK ....</span></td>
                    <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                </tr>
                {/* row 5 */}
                <tr>
                    <th>5</th>
                    <td>
                    <div className="flex items-center gap-3">
                        <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                            <img
                            src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                            alt="Avatar Tailwind CSS Component" />
                        </div>
                        </div>
                        <div>
                        <div className="font-bold">Product Name</div>
                        </div>
                    </div>
                    </td>
                    <td>
                    <span className="text-sm"> Description</span>
                    <br />
                    </td>
                    <td><span className="text-xs opacity-500">r/MakeupAddictionUK ....</span></td>
                    <th>
                    <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                </tr>
            </tbody>
        </table>
        </div>    

);
};

export default ProductsTable;