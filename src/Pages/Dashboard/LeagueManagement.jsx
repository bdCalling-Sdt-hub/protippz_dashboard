import React, { useState } from 'react';
import { Table, Button, Input, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import LeagueModal from '../../Components/League/LeagueModal';
import { Link } from 'react-router-dom';
import { useCreateLeagueMutation, useDeleteLeagueMutation, useGetAllLeagueQuery, useUpdateLeagueMutation } from '../../Redux/Apis/leagueApis';
import { url } from '../../Utils/BaseUrl';
import toast from 'react-hot-toast';

const LeagueManagement = () => {
  const [page, setPage] = useState()
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading: leagueLading, isFetching } = useGetAllLeagueQuery({ page, searchTerm: searchQuery })
  const [create, { isLoading }] = useCreateLeagueMutation()
  const [update, { isLoading: isEditing }] = useUpdateLeagueMutation()
  const [deleteLeague, { isLoading: isDeleting }] = useDeleteLeagueMutation()
  const handleAddLeague = () => {
    setIsAddModalVisible(true);
  };

  const handleEditLeague = (league) => {
    setSelectedLeague(league);
    setIsEditModalVisible(true);
  };

  const handleDeleteLeague = (leagueId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this league?',
      onOk: () => {
        deleteLeague(leagueId)
          .then(res => {
            toast.success(res?.data?.message)
          }).catch(err => {
            toast.error(err?.data?.message)
          })
      },
    });
  };

  const handleAddSubmit = (value) => {
    const { image, ...otherValues } = value
    const formData = new FormData()
    formData.append('data', JSON.stringify(otherValues))
    formData.append('league_image', image?.file
    )
    create(formData).unwrap().then(res => {
      toast.success(res?.message)
      setIsAddModalVisible(false);
    }).catch((err) => {
      toast.error(err?.data?.message)
    })
  };

  const handleEditSubmit = (value) => {
    const { image, ...otherValues } = value
    const formData = new FormData()
    formData.append('data', JSON.stringify(otherValues))
    if (image?.file) {
      formData.append('league_image', image?.file)
    }
    update({ id: selectedLeague?._id, data: formData }).unwrap().then(res => {
      toast.success(res?.message)
      setIsEditModalVisible(false);
    }).catch((err) => {
      toast.error(err?.data?.message)
    })
  };

  const columns = [
    {
      title: 'League Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Image',
      dataIndex: 'league_image',
      key: 'league_image',
      render: (league_image) => (
        <img src={league_image ? `${url}/${league_image}` : 'https://via.placeholder.com/40'} alt="League" className="w-10 h-10" />
      ),
      width: '15%',
    },
    {
      title: 'Sport',
      dataIndex: 'sport',
      key: 'sport',
      width: '20%',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEditLeague(record)}
            className="bg-green-500 border-none"
          />
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteLeague(record._id)}
            className="bg-red-500 border-none text-white"
          />
        </div>
      ),
      width: '20%',
    },
  ];

  return (
    <div className="h-screen overflow-y-scroll bg-[var(--bg-gray-20)] p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link to={-1}>
            <ArrowLeftOutlined className="text-green-500 text-xl cursor-pointer" />
          </Link>
          <h1 className="text-lg font-semibold">League Management</h1>
        </div>
        <div className="flex space-x-4">
          <Button type="primary" icon={<PlusOutlined />} className="bg-green-500 text-white" onClick={handleAddLeague}>
            Add
          </Button>
          <Input
            placeholder="Search here..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Table */}
      <Table
        loading={leagueLading || isFetching || isDeleting || isLoading}
        dataSource={data?.data?.result || []}
        columns={columns}
        rowKey="id"
        pagination={{
          position: ['bottomCenter'],
          total: data?.data?.meta?.total,
          showTotal: (total, range) => `Showing ${range[0]}-${range[1]} out of ${total}`,
          pageSize: data?.data?.meta?.limit,
          showSizeChanger: false,
          onChange: (page) => setPage(page)
        }}
        className="bg-white shadow-sm rounded-lg"
      />

      {/* Add League Modal */}
      <LeagueModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onSubmit={handleAddSubmit}
        isEdit={false}
      />

      {/* Edit League Modal */}
      <LeagueModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSubmit={handleEditSubmit}
        isEdit={true}
        leagueData={selectedLeague}
      />
    </div>
  );
};

export default LeagueManagement;
