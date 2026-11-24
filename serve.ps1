# Local HTTP Preview Server for The Ambassadors of Knowledge
param(
    [int]$Port = 3000
)

$prefix = "http://localhost:$Port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "`n========================================================" -ForegroundColor Cyan
    Write-Host " The Ambassadors of Knowledge - Local Preview Server" -ForegroundColor Green
    Write-Host " Public Website:  http://localhost:$Port/" -ForegroundColor Yellow
    Write-Host " Admin Dashboard: http://localhost:$Port/admin/" -ForegroundColor Yellow
    Write-Host " Press Ctrl+C in this window to stop the server." -ForegroundColor Gray
    Write-Host "========================================================`n" -ForegroundColor Cyan

    $baseDir = $PSScriptRoot

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawPath = [System.Net.WebUtility]::UrlDecode($request.Url.LocalPath).TrimStart('/')
        if ([string]::IsNullOrEmpty($rawPath) -or $rawPath.EndsWith('/')) {
            $rawPath += "index.html"
        }

        # Clean URLs support (e.g. /admin -> /admin/index.html)
        $filePath = [System.IO.Path]::Combine($baseDir, $rawPath.Replace('/', '\'))
        if ([System.IO.Directory]::Exists($filePath)) {
            $filePath = [System.IO.Path]::Combine($filePath, "index.html")
        } elseif (-not [System.IO.File]::Exists($filePath) -and [System.IO.File]::Exists($filePath + ".html")) {
            $filePath = $filePath + ".html"
        }

        if ([System.IO.File]::Exists($filePath)) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".json" { "application/json; charset=utf-8" }
                default { "application/octet-stream" }
            }
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errFile = [System.IO.Path]::Combine($baseDir, "404.html")
            if ([System.IO.File]::Exists($errFile)) {
                $errBytes = [System.IO.File]::ReadAllBytes($errFile)
                $response.ContentType = "text/html; charset=utf-8"
                $response.ContentLength64 = $errBytes.Length
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            } else {
                $notFoundBytes = [System.Text.Encoding]::UTF8.GetBytes("Not Found")
                $response.OutputStream.Write($notFoundBytes, 0, $notFoundBytes.Length)
            }
        }
        $response.OutputStream.Close()
    }
} catch {
    Write-Host "Server stopped: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
}
