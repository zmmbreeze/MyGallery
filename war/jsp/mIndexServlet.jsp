<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8" isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>MyGallery</title>
    <meta name="description" content="MyGallery">
</head>
<body>
    <form action="${ model.uploadUrl }" id="uploaderForm" method="POST"  enctype="multipart/form-data">
        <input type="file" name="fileUploader" />
        <input type="hidden" name="noscript" value="true" />
        <input type="submit" value="提交" />
    </form>
    <ul id="pics">
        <c:forEach items="${ model.pics }" var="pic">
        <li><img src="<c:out value="${pic.url}"/>"/><p>${pic.fileName}<br/>${pic.uploadTime}</p></li>
        </c:forEach>
    </ul>
    <a href="?cursor=${ model.cursor }">下一页</a>
</body>
</html>

