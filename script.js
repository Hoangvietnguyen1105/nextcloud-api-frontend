
const getDetailFile= (folder)=>{
    console.log("readthis")
    const path = folder; // Giả sử bạn muốn lấy nội dung của thư mục 'Photos'
    
    fetch(`http://localhost:3000/directory-contents/getfiledetail`,{
        method: 'Post',
        headers: {
            'Content-Type': 'application/json', // Bổ sung header này
        },
        body: JSON.stringify({
            folder: folder // Đảm bảo chuyển đối tượng JavaScript thành chuỗi JSON
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Hiển thị data trên trang web theo yêu cầu
        })
        .catch(error => console.error('Error fetching directory contents:', error));
}
const addStudent = ()=>{
    const name = prompt("Nhập tên học sinh mới:");
    if (name) {
      const studentList = document.getElementById("folder-list");
      studentList.innerHTML += `<button href="#" onclick="getDetailFile('${name}');">${name}</button>`;
    }
  }

function downloadFile(filePath) {
    const downloadUrl = `http://localhost:3000/directory-contents/download?filePath=${encodeURIComponent(filePath)}`;
    // Sử dụng window.location để trigger việc download thay vì fetch
    window.location = downloadUrl;
  }
  function viewfile(filePath) {
    const downloadUrl = `http://localhost:3000/directory-contents/view?filePath=${encodeURIComponent(filePath)}`;
    // Sử dụng fetch để truy cập file
    fetch(downloadUrl)
        .then(response => {
          console.log('done')
            if (response.ok) {
                return response.blob();  // hoặc response.text() nếu bạn biết nội dung là văn bản
            }
            throw new Error('Network response was not ok.');
        })
        .then(data => {
            // Tạo một URL từ blob
            const url = window.URL.createObjectURL(data);
            // Mở URL trong một tab mới
            window.open(url, '_blank');
        })
        .catch(error => {
            console.error('Error fetching the file:', error);
        });
  }
  function uploadFile(folder) {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const filePath = folder + '/' + file.name; // Bạn có thể thay đổi đường dẫn theo yêu cầu
  
    const formData = new FormData();
    formData.append('file', file);
  
    fetch(`http://localhost:3000/directory-contents/upload?filePath=${encodeURIComponent(filePath)}`, {
      method: 'PUT',
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      alert(data.message); // Hiển thị thông báo thành công
    })
    .catch(error => {
      console.error('Error uploading file:', error);
      alert('Error uploading file'); // Hiển thị thông báo lỗi
    });
  }
  //list all folder
  function listFolder(folderPath) {
    const xhr = new XMLHttpRequest();
    const url = `http://localhost:3000/directory-contents/list-folder?path=${encodeURIComponent(folderPath)}`;
    xhr.open('PROPFIND', url, true);
    xhr.setRequestHeader('Content-Type', 'application/xml'); // Đặt Content-Type thích hợp nếu cần
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('Response:', JSON.parse(xhr.responseText));
        // Xử lý kết quả liệt kê folder tại đây
      } else {
        console.error('Failed to list folder:', xhr.status, xhr.statusText);
      }
    };
    xhr.onerror = function () {
      console.error('Error making the request');
    };
  
    // Gửi yêu cầu
    xhr.send();
  }
  //lấy thông tin được gắn vào url
  function getQueryParam(param) {
    const searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams.get(param))
    return searchParams.get(param);
}

