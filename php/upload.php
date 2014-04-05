<?php

$uploaddir = '../uploads/';
$name = time() . ".jpg";
$uploadfile = $uploaddir . $name;

if (move_uploaded_file($_FILES['photo']['tmp_name'], $uploadfile)) {
    
} else {
    echo "Ошибка!\n";
}

$image = imagecreatefromjpeg($uploadfile);
$exif = exif_read_data($uploadfile);
if(!empty($exif['Orientation'])) {
    switch($exif['Orientation']) {
        case 8:
            $image = imagerotate($image,90,0);
            break;
        case 3:
            $image = imagerotate($image,180,0);
            break;
        case 6:
            $image = imagerotate($image,-90,0);
            break;
    }
}

imagejpeg($image, $uploadfile);

print_r($name);

?>