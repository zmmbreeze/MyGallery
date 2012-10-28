<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE HTML>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>MyGallery</title>
    <noscript><meta http-equiv="refresh" content="0; URL=/m/" /></noscript>
    <meta name="description" content="MyGallery" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <c:choose>
    <c:when test="${ debug }">
    <link rel="stylesheet" href="/src/skin/normalize.1.0.1.css" />
    <link rel="stylesheet" href="/src/skin/gallery.css" />
    </c:when>
    <c:otherwise>
    <link rel="stylesheet" href="/skin/gallery.css" />
    </c:otherwise>
    </c:choose>
</head>
<body>
<div class="container-wp">
    <div id="container" class="container">
        <div class="side">
            <form action="${ model.uploadUrl }" id="uploaderForm" method="POST"  enctype="multipart/form-data" class="uploader">
                <input type="file" name="fileUploader" />
                <input type="hidden" name="noscript" value="true" />
                <input type="submit" value="提交" />
            </form>
        </div>

        <div class="main" id="main">
            <div class="header">
                <h1>My Gallery</h1>
                <a class="header-setup" href="javascript: void 0;" id="showSide">上传</a>
                <a class="header-edit" href="javascript: void 0;" id="startEdit">编辑</a>
            </div>
            <ul id="pics" class="pictures">
            </ul>
            <div id="pullUp" class="pictures-up">
                <a href="javascript:void 0;">加载更多...</a>
            </div>
        </div>
    </div>
</div>
    <!-- <div id="overlay" class="overlay overlay-hide"></div> -->
    <script>
    var GLOBAL = {
            uploadUrl: '${ model.uploadUrl }'
        },
        GJS_PRELOAD = ['jQuery', 'GUtils'];
    </script>
    <c:choose>
    <c:when test="${ debug }">
    <script src="/src/js/G.js"></script>
    <script src="/src/js/gallery.js"></script>
    </c:when>
    <c:otherwise>
    <script src="/js/gallery.js"></script>
    </c:otherwise>
    </c:choose>
</body>
</html>
